from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from datetime import datetime

# ==========================================
#  CONFIGURACIÓN SERVIDOR
# ==========================================
app = Flask(__name__)
CORS(app)


def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="2004",   # tu clave
        database="inventario_automotriz"
    )


# ==========================================
#  PRODUCTOS
# ==========================================
@app.route("/productos", methods=["GET"])
def get_productos():
    db = conectar()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM productos ORDER BY id ASC")
    data = cur.fetchall()
    cur.close()
    db.close()
    return jsonify(data)


@app.route("/productos/<int:id>", methods=["PUT"])
def update_producto(id):
    data = request.json
    db = conectar()
    cur = db.cursor()

    sql = """
        UPDATE productos 
        SET nombre_producto=%s, etiqueta=%s, stock=%s, precio=%s
        WHERE id=%s
    """
    cur.execute(sql, (
        data["nombre_producto"],
        data["etiqueta"],
        data["stock"],
        data["precio"],
        id
    ))

    db.commit()
    cur.close()
    db.close()
    return jsonify({"msg": "producto actualizado"})


@app.route("/productos/<int:id>", methods=["DELETE"])
def delete_producto(id):
    db = conectar()
    cur = db.cursor()
    cur.execute("DELETE FROM productos WHERE id=%s", (id,))
    db.commit()
    cur.close()
    db.close()
    return jsonify({"msg": "producto eliminado"})


# ==========================================
#  CATEGORÍAS
# ==========================================
@app.route("/categorias", methods=["GET"])
def get_categorias():
    db = conectar()
    cur = db.cursor()
    cur.execute("""
        SELECT DISTINCT etiqueta 
        FROM productos 
        WHERE etiqueta IS NOT NULL 
        ORDER BY etiqueta ASC
    """)
    data = [row[0] for row in cur.fetchall()]
    cur.close()
    db.close()
    return jsonify(data)


# ==========================================
#  COMPRAS
# ==========================================
@app.route("/compras", methods=["GET"])
def get_compras():
    db = conectar()
    cur = db.cursor(dictionary=True)

    cur.execute("""
        SELECT c.id,
               c.producto_id,
               p.nombre_producto,
               c.cantidad,
               c.precio_compra,
               (c.cantidad * c.precio_compra) AS total_compra,
               c.fecha
        FROM compras c
        JOIN productos p ON c.producto_id = p.id
        ORDER BY c.fecha DESC
    """)

    data = cur.fetchall()
    cur.close()
    db.close()
    return jsonify(data)


@app.route("/compras", methods=["POST"])
def add_compra():
    data = request.json
    producto_id = data["producto_id"]
    cantidad = data["cantidad"]
    precio = data["precio_compra"]
    fecha = datetime.now()

    db = conectar()
    cur = db.cursor()

    # Insertar compra
    cur.execute("""
        INSERT INTO compras (producto_id, cantidad, precio_compra, fecha)
        VALUES (%s, %s, %s, %s)
    """, (producto_id, cantidad, precio, fecha))

    # SUMAR stock del producto
    cur.execute("""
        UPDATE productos 
        SET stock = stock + %s 
        WHERE id=%s
    """, (cantidad, producto_id))

    # Registrar movimiento (COMPRA)
    cur.execute("""
        INSERT INTO movimientos (producto_id, tipo, cantidad, fecha)
        VALUES (%s, %s, %s, %s)
    """, (producto_id, "COMPRA", cantidad, fecha))

    db.commit()
    cur.close()
    db.close()
    return jsonify({"msg": "compra registrada"})


@app.route("/compras/<int:id>", methods=["DELETE"])
def delete_compra(id):
    db = conectar()
    cur = db.cursor(dictionary=True)

    # Obtener compra antes de eliminar
    cur.execute("SELECT * FROM compras WHERE id=%s", (id,))
    compra = cur.fetchone()

    if not compra:
        cur.close()
        db.close()
        return jsonify({"error": "compra no encontrada"}), 404

    producto_id = compra["producto_id"]
    cantidad = compra["cantidad"]
    fecha = compra["fecha"]

    # Restar stock (reversar la compra)
    cur2 = db.cursor()
    cur2.execute("""
        UPDATE productos
        SET stock = stock - %s
        WHERE id=%s
    """, (cantidad, producto_id))

    # Eliminar movimiento asociado (mismo producto, cantidad y fecha)
    cur2.execute("""
        DELETE FROM movimientos
        WHERE tipo='COMPRA'
          AND producto_id=%s
          AND cantidad=%s
          AND fecha=%s
        LIMIT 1
    """, (producto_id, cantidad, fecha))

    # Eliminar compra
    cur2.execute("DELETE FROM compras WHERE id=%s", (id,))

    db.commit()
    cur.close()
    cur2.close()
    db.close()
    return jsonify({"msg": "compra eliminada"})


# ==========================================
#  VENTAS
# ==========================================
@app.route("/ventas", methods=["GET"])
def get_ventas():
    db = conectar()
    cur = db.cursor(dictionary=True)

    cur.execute("""
        SELECT v.id,
               v.producto_id,
               p.nombre_producto,
               v.cantidad,
               v.precio_unitario,
               v.total,
               v.fecha
        FROM ventas v
        JOIN productos p ON v.producto_id = p.id
        ORDER BY v.fecha DESC
    """)

    data = cur.fetchall()
    cur.close()
    db.close()
    return jsonify(data)


@app.route("/ventas", methods=["POST"])
def add_venta():
    data = request.json
    producto_id = data["producto_id"]
    cantidad = data["cantidad"]
    fecha = datetime.now()

    db = conectar()
    cur = db.cursor(dictionary=True)

    # Ver stock y precio
    cur.execute("SELECT stock, precio FROM productos WHERE id=%s", (producto_id,))
    producto = cur.fetchone()

    if not producto:
        cur.close()
        db.close()
        return jsonify({"error": "Producto no encontrado"}), 404

    if producto["stock"] < cantidad:
        cur.close()
        db.close()
        return jsonify({"error": "Stock insuficiente"}), 400

    precio_unitario = producto["precio"] or 0
    total = precio_unitario * cantidad

    # Registrar venta
    cur2 = db.cursor()
    cur2.execute("""
        INSERT INTO ventas (producto_id, cantidad, precio_unitario, total, fecha)
        VALUES (%s, %s, %s, %s, %s)
    """, (producto_id, cantidad, precio_unitario, total, fecha))

    # Restar stock
    cur2.execute("""
        UPDATE productos
        SET stock = stock - %s
        WHERE id=%s
    """, (cantidad, producto_id))

    # Registrar movimiento (VENTA)
    cur2.execute("""
        INSERT INTO movimientos (producto_id, tipo, cantidad, fecha)
        VALUES (%s, %s, %s, %s)
    """, (producto_id, "VENTA", cantidad, fecha))

    db.commit()
    cur.close()
    cur2.close()
    db.close()
    return jsonify({"msg": "venta registrado"})


@app.route("/ventas/<int:id>", methods=["DELETE"])
def delete_venta(id):
    db = conectar()
    cur = db.cursor(dictionary=True)

    # Obtener info de venta
    cur.execute("SELECT * FROM ventas WHERE id=%s", (id,))
    venta = cur.fetchone()

    if not venta:
        cur.close()
        db.close()
        return jsonify({"error": "venta no encontrada"}), 404

    producto_id = venta["producto_id"]
    cantidad = venta["cantidad"]
    fecha = venta["fecha"]

    cur2 = db.cursor()
    # Devolver stock
    cur2.execute("""
        UPDATE productos
        SET stock = stock + %s
        WHERE id=%s
    """, (cantidad, producto_id))

    # Eliminar movimiento asociado
    cur2.execute("""
        DELETE FROM movimientos
        WHERE tipo='VENTA'
          AND producto_id=%s
          AND cantidad=%s
          AND fecha=%s
        LIMIT 1
    """, (producto_id, cantidad, fecha))

    # Eliminar venta
    cur2.execute("DELETE FROM ventas WHERE id=%s", (id,))

    db.commit()
    cur.close()
    cur2.close()
    db.close()
    return jsonify({"msg": "venta eliminada"})


# ==========================================
#  MOVIMIENTOS
# ==========================================
@app.route("/movimientos", methods=["GET"])
def get_movimientos():
    db = conectar()
    cur = db.cursor(dictionary=True)

    cur.execute("""
        SELECT 
            m.id,
            m.tipo,
            m.cantidad,
            m.fecha,
            p.nombre_producto,
            m.producto_id
        FROM movimientos m
        JOIN productos p ON m.producto_id = p.id
        ORDER BY m.fecha DESC
    """)
    data = cur.fetchall()

    cur.close()
    db.close()
    return jsonify(data)


@app.route("/movimientos/<int:id>", methods=["DELETE"])
def delete_movimiento(id):
    db = conectar()
    cur = db.cursor(dictionary=True)

    # Buscar movimiento
    cur.execute("SELECT * FROM movimientos WHERE id=%s", (id,))
    mov = cur.fetchone()

    if not mov:
        cur.close()
        db.close()
        return jsonify({"error": "movimiento no encontrado"}), 404

    producto_id = mov["producto_id"]
    cantidad = mov["cantidad"]
    tipo = mov["tipo"]
    fecha = mov["fecha"]

    cur2 = db.cursor()

    # Ajustar stock según el tipo
    if tipo == "COMPRA":
        # Se había sumado stock, ahora lo restamos
        cur2.execute("""
            UPDATE productos
            SET stock = stock - %s
            WHERE id=%s
        """, (cantidad, producto_id))

        # Borrar compra asociada (mismo producto, cantidad y fecha)
        cur2.execute("""
            DELETE FROM compras
            WHERE producto_id=%s
              AND cantidad=%s
              AND fecha=%s
            LIMIT 1
        """, (producto_id, cantidad, fecha))

    elif tipo == "VENTA":
        # Se había restado stock, ahora lo devolvemos
        cur2.execute("""
            UPDATE productos
            SET stock = stock + %s
            WHERE id=%s
        """, (cantidad, producto_id))

        # Borrar venta asociada
        cur2.execute("""
            DELETE FROM ventas
            WHERE producto_id=%s
              AND cantidad=%s
              AND fecha=%s
            LIMIT 1
        """, (producto_id, cantidad, fecha))

    # Finalmente borrar el movimiento
    cur2.execute("DELETE FROM movimientos WHERE id=%s", (id,))

    db.commit()
    cur.close()
    cur2.close()
    db.close()
    return jsonify({"msg": "movimiento eliminado"})


# ==========================================
#  INICIAR SERVIDOR
# ==========================================
if __name__ == "__main__":
    print("✅ Servidor Flask iniciando...")
    app.run(debug=True)
