/* ============================================================
   script.js — Vasconcellos Automotriz
============================================================ */

const API = "http://127.0.0.1:5000";
let productosCache = [];

/* ============================================================
   FORMATOS
============================================================ */

function formatearPrecio(n) {
  return Number(n).toLocaleString("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function fechaEspañol(f) {
  const fecha = new Date(f);
  return fecha.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function etiquetaMesClave(f) {
  const d = new Date(f);
  return {
    clave: `${d.getFullYear()}-${d.getMonth() + 1}`,
    label: d.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long"
    }).toUpperCase()
  };
}

function toggleMes(headerDiv) {
  const card = headerDiv.parentElement;
  const contenido = card.querySelector(".mes-contenido");
  if (!contenido) return;

  contenido.style.display =
    contenido.style.display === "block" ? "none" : "block";
}

/* ============================================================
   INVENTARIO — ACORDEÓN
============================================================ */

function toggleInventario() {
  const sub = document.getElementById("submenu-inventario");
  const arrow = document.getElementById("arrow-inv");

  if (sub.style.display === "block") {
    sub.style.display = "none";
    arrow.textContent = "▸";
  } else {
    sub.style.display = "block";
    arrow.textContent = "▾";
  }
}

function clickInventario() {
  const dash = document.getElementById("dashboard");
  if (dash.style.display === "none") {
    mostrarDashboard();
  } else {
    toggleInventario();
  }
}

/* ============================================================
   CARGAR CATEGORÍAS
============================================================ */

async function cargarCategorias() {
  const resp = await fetch(`${API}/categorias`);
  const categorias = await resp.json();

  const sub = document.getElementById("submenu-inventario");
  sub.innerHTML = "";

  const btn = document.createElement("button");
  btn.textContent = "📦 Inventario completo";
  btn.onclick = () => mostrarDashboard();
  sub.appendChild(btn);

  categorias.forEach(cat => {
    const b = document.createElement("button");
    b.textContent = cat;
    b.onclick = () => mostrarSoloCategoria(cat);
    sub.appendChild(b);
  });
}

/* ============================================================
   INVENTARIO
============================================================ */

async function mostrar() {
  const r = await fetch(`${API}/productos`);
  productosCache = await r.json();
  renderProductos(productosCache);
}

function renderProductos(lista) {
  const tb = document.getElementById("tablaProductos");

  tb.innerHTML = lista.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.nombre_producto}</td>
      <td>${p.etiqueta || ""}</td>
      <td class="${
        p.stock <= 5 ? "stock-bajo" :
        p.stock <= 15 ? "stock-medio" :
        "stock-alto"
      }">${p.stock}</td>
      <td>$${formatearPrecio(p.precio)}</td>
      <td>
        <button onclick="editarProducto(${p.id})">✏️</button>
        <button onclick="eliminarProducto(${p.id})">🗑️</button>
      </td>
    </tr>
  `).join("");
}

function buscarProducto() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const filtrado = productosCache.filter(p =>
    p.nombre_producto.toLowerCase().includes(texto) ||
    (p.etiqueta && p.etiqueta.toLowerCase().includes(texto))
  );
  renderProductos(filtrado);
}

function mostrarSoloCategoria(cat) {
  ocultarTodo();
  const dash = document.getElementById("dashboard");
  dash.style.display = "block";

  cargarCategorias();
  const sub = document.getElementById("submenu-inventario");
  sub.style.display = "block";
  document.getElementById("arrow-inv").textContent = "▾";

  const filtrado = productosCache.filter(p => p.etiqueta === cat);
  renderProductos(filtrado);
}

/* ============================================================
   EDITAR / ELIMINAR PRODUCTO
============================================================ */

async function editarProducto(id) {
  const p = productosCache.find(x => x.id === id);
  if (!p) return;

  const { value: nombre } = await Swal.fire({
    title: "Editar nombre",
    input: "text",
    inputValue: p.nombre_producto,
    showCancelButton: true
  });
  if (!nombre) return;

  const { value: etiqueta } = await Swal.fire({
    title: "Editar categoría",
    input: "text",
    inputValue: p.etiqueta,
    showCancelButton: true
  });
  if (!etiqueta) return;

  const { value: stock } = await Swal.fire({
    title: "Editar stock",
    input: "number",
    inputValue: p.stock,
    showCancelButton: true
  });
  if (stock === null) return;

  const { value: precio } = await Swal.fire({
    title: "Editar precio",
    input: "number",
    inputValue: p.precio,
    showCancelButton: true
  });
  if (precio === null) return;

  await fetch(`${API}/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre_producto: nombre,
      etiqueta: etiqueta,
      stock: Number(stock),
      precio: Number(precio)
    })
  });

  Swal.fire("Correcto", "Producto actualizado", "success");
  await mostrar();
  await cargarCategorias();
}

async function eliminarProducto(id) {
  const r = await Swal.fire({
    title: "¿Eliminar?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar"
  });
  if (!r.isConfirmed) return;

  await fetch(`${API}/productos/${id}`, { method: "DELETE" });
  Swal.fire("Eliminado", "Producto borrado", "success");
  await mostrar();
  await cargarCategorias();
}

/* ============================================================
   MOVIMIENTOS — DOS COLUMNAS (COMPRAS / VENTAS)
============================================================ */

async function cargarMovimientos() {
  const mov = await (await fetch(`${API}/movimientos`)).json();
  const ventas = await (await fetch(`${API}/ventas`)).json();
  const compras = await (await fetch(`${API}/compras`)).json();

  const meses = {};

  function addMes(f) {
    const { clave, label } = etiquetaMesClave(f);
    if (!meses[clave]) meses[clave] = {
      label,
      ventas: [],
      compras: []
    };
    return clave;
  }

  ventas.forEach(v => meses[addMes(v.fecha)].ventas.push(v));
  compras.forEach(c => meses[addMes(c.fecha)].compras.push(c));

  const cont = document.getElementById("tablaMovimientos");
  cont.innerHTML = "";

  Object.keys(meses).sort().reverse().forEach(clave => {
    const info = meses[clave];

    const totalVentas = info.ventas.reduce((a, v) => a + Number(v.total), 0);
    const totalCompras = info.compras.reduce((a, c) => a + Number(c.total_compra), 0);
    const gan = totalVentas - totalCompras;

    const card = document.createElement("div");
    card.className = "mes-card";

    const header = document.createElement("div");
    header.className = "mes-header";
    header.onclick = () => toggleMes(header);
    header.innerHTML = `
      📅 ${info.label}<br>
      Ventas: $${formatearPrecio(totalVentas)} —
      Compras: $${formatearPrecio(totalCompras)}<br>
      Ganancia: $${formatearPrecio(gan)} ${gan >= 0 ? "🟩" : "🟥"}<br>
      <span style="opacity:.7;">▼ Ver detalles</span>
    `;

    const contenido = document.createElement("div");
    contenido.className = "mes-contenido";
    contenido.style.display = "none";

    contenido.innerHTML = `
      <div class="mov-columns">

        <div class="mov-col compras">
          <h4 class="mov-compras-title">🛒 COMPRAS</h4>
          ${info.compras.map(c => `
            <div class="venta-item">
              <span>
                ${c.nombre_producto}<br>
                Cant: ${c.cantidad}<br>
                Precio: $${formatearPrecio(c.precio_compra)}<br>
                Total: $${formatearPrecio(c.total_compra)}<br>
                Fecha: ${fechaEspañol(c.fecha)}
              </span>
            </div>
          `).join("")}
        </div>

        <div class="mov-col ventas">
          <h4 class="mov-ventas-title">💰 VENTAS</h4>
          ${info.ventas.map(v => `
            <div class="venta-item">
              <span>
                ${v.nombre_producto}<br>
                Cant: ${v.cantidad}<br>
                Precio: $${formatearPrecio(v.precio_unitario)}<br>
                Total: $${formatearPrecio(v.total)}<br>
                Fecha: ${fechaEspañol(v.fecha)}
              </span>
            </div>
          `).join("")}
        </div>

      </div>
    `;

    card.appendChild(header);
    card.appendChild(contenido);
    cont.appendChild(card);
  });
}

/* ============================================================
   COMPRAS
============================================================ */

async function cargarCategoriasCompra() {
  const r = await fetch(`${API}/categorias`);
  const cats = await r.json();
  document.getElementById("compraCategoria").innerHTML =
    cats.map(c => `<option>${c}</option>`).join("");
}

async function filtrarProductosCompra() {
  const cat = document.getElementById("compraCategoria").value;
  const productos = await (await fetch(`${API}/productos`)).json();
  document.getElementById("compraProducto").innerHTML =
    productos.filter(p => p.etiqueta === cat)
      .map(p => `<option value="${p.id}">${p.nombre_producto}</option>`).join("");
}

function actualizarTotalCompra() {
  const p = Number(document.getElementById("compraPrecio").value || 0);
  const c = Number(document.getElementById("compraCantidad").value || 0);
  document.getElementById("compraTotal").value = "$" + formatearPrecio(p * c);
}

async function registrarCompra() {
  const producto_id = Number(document.getElementById("compraProducto").value);
  const cantidad = Number(document.getElementById("compraCantidad").value);
  const precio_compra = Number(document.getElementById("compraPrecio").value);

  if (!producto_id || cantidad <= 0 || precio_compra <= 0) {
    Swal.fire("Error", "Completa todos los datos", "error");
    return;
  }

  await fetch(`${API}/compras`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ producto_id, cantidad, precio_compra })
  });

  Swal.fire("Correcto", "Compra registrada", "success");

  await mostrar();
  await cargarCompras();
  await cargarMovimientos();
}

async function cargarCompras() {
  const data = await (await fetch(`${API}/compras`)).json();

  const cont = document.getElementById("comprasMeses");
  cont.innerHTML = "";

  const meses = {};
  data.forEach(c => {
    const { label } = etiquetaMesClave(c.fecha);
    if (!meses[label]) meses[label] = [];
    meses[label].push(c);
  });

  Object.keys(meses).forEach(label => {
    const lista = meses[label];
    const total = lista.reduce((a, c) => a + Number(c.total_compra), 0);

    const card = document.createElement("div");
    card.className = "mes-card";

    const header = document.createElement("div");
    header.className = "mes-header";
    header.onclick = () => toggleMes(header);
    header.innerHTML = `
      📅 ${label} — Total compras: $${formatearPrecio(total)}
      <br><span style="opacity:.7;">▼ Ver detalles</span>
    `;

    const contenido = document.createElement("div");
    contenido.className = "mes-contenido";
    contenido.style.display = "none";

    lista.forEach(c => {
      const item = document.createElement("div");
      item.className = "venta-item";
      item.innerHTML = `
        <span>
          📦 ${c.nombre_producto}<br>
          Cantidad: ${c.cantidad} unidades<br>
          Precio: $${formatearPrecio(c.precio_compra)}<br>
          Total: $${formatearPrecio(c.total_compra)}<br>
          Fecha: ${fechaEspañol(c.fecha)}
        </span>
        <button class="boton-eliminar" onclick="eliminarCompra(${c.id})">🗑️</button>
      `;
      contenido.appendChild(item);
    });

    card.appendChild(header);
    card.appendChild(contenido);
    cont.appendChild(card);
  });
}

async function eliminarCompra(id) {
  const r = await Swal.fire({
    title: "¿Eliminar compra?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar"
  });
  if (!r.isConfirmed) return;

  await fetch(`${API}/compras/${id}`, { method: "DELETE" });
  Swal.fire("Eliminada", "Compra borrada", "success");

  await mostrar();
  await cargarCompras();
  await cargarMovimientos();
}

/* ============================================================
   VENTAS
============================================================ */

async function cargarCategoriasVenta() {
  const r = await fetch(`${API}/categorias`);
  const cats = await r.json();
  document.getElementById("ventaCategoria").innerHTML =
    cats.map(c => `<option>${c}</option>`).join("");
}

async function filtrarProductosVenta() {
  const cat = document.getElementById("ventaCategoria").value;
  const productos = await (await fetch(`${API}/productos`)).json();

  document.getElementById("ventaProducto").innerHTML =
    productos.filter(p => p.etiqueta === cat)
      .map(p => `
        <option value="${p.id}" data-precio="${p.precio}">
          ${p.nombre_producto}
        </option>
      `).join("");

  actualizarPrecioYTotal();
}

function actualizarPrecioYTotal() {
  const sel = document.getElementById("ventaProducto");
  if (!sel || !sel.options.length) return;

  const precio = Number(sel.options[sel.selectedIndex].dataset.precio);
  const cant = Number(document.getElementById("ventaCantidad").value || 0);

  document.getElementById("ventaPrecio").value = "$" + formatearPrecio(precio);
  document.getElementById("ventaTotal").value = "$" + formatearPrecio(precio * cant);
}

async function registrarVenta() {
  const producto_id = Number(document.getElementById("ventaProducto").value);
  const cantidad = Number(document.getElementById("ventaCantidad").value);

  if (!producto_id || cantidad <= 0) {
    Swal.fire("Error", "Cantidad inválida", "error");
    return;
  }

  const r = await fetch(`${API}/ventas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ producto_id, cantidad })
  });

  const data = await r.json();
  if (data.error) {
    Swal.fire("Error", data.error, "error");
    return;
  }

  Swal.fire("Correcto", "Venta registrada", "success");

  await mostrar();
  await cargarVentas();
  await cargarMovimientos();
}

async function cargarVentas() {
  const data = await (await fetch(`${API}/ventas`)).json();
  const cont = document.getElementById("ventasMeses");
  cont.innerHTML = "";

  const meses = {};
  data.forEach(v => {
    const { label } = etiquetaMesClave(v.fecha);
    if (!meses[label]) meses[label] = [];
    meses[label].push(v);
  });

  Object.keys(meses).forEach(label => {
    const lista = meses[label];
    const total = lista.reduce((ac, v) => ac + Number(v.total), 0);

    const card = document.createElement("div");
    card.className = "mes-card";

    const header = document.createElement("div");
    header.className = "mes-header";
    header.onclick = () => toggleMes(header);
    header.innerHTML = `
      📅 ${label} — Total ventas: $${formatearPrecio(total)}
      <br><span style="opacity:.7;">▼ Ver detalles</span>
    `;

    const contenido = document.createElement("div");
    contenido.className = "mes-contenido";
    contenido.style.display = "none";

    lista.forEach(v => {
      const item = document.createElement("div");
      item.className = "venta-item";
      item.innerHTML = `
        <span>
          📦 ${v.nombre_producto}<br>
          Cantidad: ${v.cantidad} unidades<br>
          Precio: $${formatearPrecio(v.precio_unitario)}<br>
          Total: $${formatearPrecio(v.total)}<br>
          Fecha: ${fechaEspañol(v.fecha)}
        </span>
        <button class="boton-eliminar" onclick="eliminarVenta(${v.id})">🗑️</button>
      `;
      contenido.appendChild(item);
    });

    card.appendChild(header);
    card.appendChild(contenido);
    cont.appendChild(card);
  });
}

async function eliminarVenta(id) {
  const r = await Swal.fire({
    title: "¿Eliminar venta?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar"
  });
  if (!r.isConfirmed) return;

  await fetch(`${API}/ventas/${id}`, { method: "DELETE" });
  Swal.fire("Eliminada", "Venta borrada", "success");

  await mostrar();
  await cargarVentas();
  await cargarMovimientos();
}

/* ============================================================
   NAV
============================================================ */

function ocultarTodo() {
  ["dashboard", "ventas", "compras", "movimientos", "ajustes"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

async function mostrarDashboard() {
  ocultarTodo();
  const dash = document.getElementById("dashboard");
  dash.style.display = "block";

  await mostrar();
  await cargarCategorias();
  document.getElementById("submenu-inventario").style.display = "block";
  document.getElementById("arrow-inv").textContent = "▾";
}

function mostrarMovimientos() {
  ocultarTodo();
  document.getElementById("movimientos").style.display = "block";
  cargarMovimientos();
}

function mostrarVentas() {
  ocultarTodo();
  document.getElementById("ventas").style.display = "block";
  cargarCategoriasVenta();
  filtrarProductosVenta();
  cargarVentas();
}

function mostrarCompras() {
  ocultarTodo();
  document.getElementById("compras").style.display = "block";
  cargarCategoriasCompra();
  filtrarProductosCompra();
  cargarCompras();
}

function mostrarAjustes() {
  ocultarTodo();
  document.getElementById("ajustes").style.display = "block";

  const temaGuardado = localStorage.getItem("tema-activo") || "azul";
  document.getElementById("temaSelect").value = temaGuardado;
}

/* ============================================================
   TEMAS (AJUSTES)
============================================================ */

const TEMAS_DISPONIBLES = ["azul", "verde", "rojo", "morado"];

function aplicarTema(nombre) {
  TEMAS_DISPONIBLES.forEach(t => document.body.classList.remove("tema-" + t));
  document.body.classList.add("tema-" + nombre);
}

function cargarTema() {
  const temaGuardado = localStorage.getItem("tema-activo") || "azul";
  aplicarTema(temaGuardado);
}

function cambiarTema() {
  const tema = document.getElementById("temaSelect").value;
  aplicarTema(tema);
  localStorage.setItem("tema-activo", tema);
}

function restaurarTema() {
  localStorage.removeItem("tema-activo");
  aplicarTema("azul");
  Swal.fire("Tema restaurado", "Volvió al tema azul", "success");
}

/* ============================================================
   INICIO
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  cargarTema();
  mostrarDashboard();
});
