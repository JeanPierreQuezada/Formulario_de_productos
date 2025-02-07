document.addEventListener("DOMContentLoaded", function () {
    cargarBodegas();
    cargarMonedas();

    document.getElementById("bodega").addEventListener("change", cargarSucursales);
    document.getElementById("productForm").addEventListener("submit", validarFormulario);
});

function cargarBodegas() {
    fetch("http://localhost:8000/api/get_bodegas.php")
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById("bodega");
            data.forEach(bodega => {
                let option = document.createElement("option");
                option.value = bodega.id;
                option.textContent = bodega.nombre;
                select.appendChild(option);
            });
        });
}

function cargarMonedas() {
    fetch("http://localhost:8000/api/get_monedas.php")
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById("moneda");
            data.forEach(moneda => {
                let option = document.createElement("option");
                option.value = moneda.id;
                option.textContent = moneda.nombre;
                select.appendChild(option);
            });
        });
}

function cargarSucursales() {
    let bodegaId = document.getElementById("bodega").value;
    fetch(`http://localhost:8000/api/get_sucursales.php?bodega_id=${bodegaId}`)
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById("sucursal");
            select.innerHTML = '<option value="">Seleccione...</option>';
            data.forEach(sucursal => {
                let option = document.createElement("option");
                option.value = sucursal.id;
                option.textContent = sucursal.nombre;
                select.appendChild(option);
            });
        });
}

function validarFormulario(event) {
    event.preventDefault();
    let codigo = document.getElementById("codigo").value;
    
    fetch(`http://localhost:8000/api/validar_codigo.php?codigo=${codigo}`)
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                alert("El código del producto ya está registrado.");
            } else {
                guardarProducto();
            }
        });
}

function guardarProducto() {
    let formData = new FormData(document.getElementById("productForm"));

    fetch("http://localhost:8000/api/save_producto.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    });
}