import CONFIG from './config.js';

// Validación del campo Código
document.addEventListener("DOMContentLoaded", function () {
    const inputCodigo = document.getElementById("codigo");
    const inputNombre = document.getElementById("nombre");
    const errorMsg = document.getElementById("msg-codigo");
    const errorMsgNombre = document.getElementById("msg-nombre");
    const botonGuardar = document.getElementById("guardar");

    // Listener Código
    inputCodigo.addEventListener("focus", function () {
        validarCodigo();
    });

    inputCodigo.addEventListener("input", function () {
        validarCodigo();
    });

    // Listener Nombre
    inputNombre.addEventListener("focus", function () {
        validarNombre();
    });

    inputNombre.addEventListener("input", function () {
        validarNombre();
    });

    // Listener Enviar
    botonGuardar.addEventListener("click", function (event) {
        event.preventDefault();
        if (validarCodigo()) {
            // Envío al backend
            validarCodigoBackend(inputCodigo.value);
            validarNombreBackend(inputNombre.value)
        }
    });

    // Personalización de estilo por errores
    function aplicarEstilo(esValido,name) {
        if (esValido) {
            name.classList.add("valid");
            name.classList.remove("error");
        } else {
            name.classList.add("error");
            name.classList.remove("valid");
        }
    }

    // Codigo
    function validarCodigo() {
        const valor = inputCodigo.value.trim();
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/;

        if (valor.length === 0) {
            errorMsg.textContent = "El código del producto no puede estar en blanco";
            aplicarEstilo(false);
            return false;
        } else if (!regex.test(valor)) {
            errorMsg.textContent = "El código del producto solo debe contener letras y números";
            aplicarEstilo(false);
            return false;
        } else if (valor.length < 5 || valor.length > 15) {
            errorMsg.textContent = "El código del producto debe tener entre 5 y 15 caracteres";
            aplicarEstilo(false);
            return false;
        } else {
            errorMsg.textContent = "";
            aplicarEstilo(true);
            return true;
        }
    }

    function validarCodigoBackend(codigo) {
        fetch(`${CONFIG.API_BASE_URL}validar_codigo.php?codigo=` + encodeURIComponent(codigo))
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                errorMsg.textContent = data.error;
                aplicarEstilo(false,inputCodigo);
                return;
            }

            if (!data.unico) {
                errorMsg.textContent = "El código del producto ya está registrado";
                aplicarEstilo(false,inputCodigo);
            } else {
                errorMsg.textContent = "";
                aplicarEstilo(true,inputCodigo);
            }
        })
        .catch(error => {
            console.error("Error en la validación del código:", error);
            errorMsg.textContent = "Error al validar. Intenta de nuevo.";
            aplicarEstilo(false);
        });
    }

    // Nombre
    function validarNombre() {
        const valor = inputNombre.value.trim();
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]+$/;

        if (valor.length === 0) {
            errorMsgNombre.textContent = "El nombre del producto no puede estar en blanco";
            aplicarEstilo(false);
            return false;
        } else if (!regex.test(valor)) {
            errorMsgNombre.textContent = "El nombre del producto solo debe contener letras.";
            aplicarEstilo(false);
            return false;
        } else if (valor.length < 2 || valor.length > 50) {
            errorMsgNombre.textContent = "El nombre del producto debe tener entre 5 y 50 caracteres";
            aplicarEstilo(false);
            return false;
        } else {
            errorMsgNombre.textContent = "";
            aplicarEstilo(true);
            return true;
        }
    }

    function validarNombreBackend(nombre) {
        fetch(`${CONFIG.API_BASE_URL}validar_nombre.php?nombre=` + encodeURIComponent(nombre))
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                errorMsgNombre.textContent = data.error;
                aplicarEstilo(false,inputNombre);
                return;
            } else {
                errorMsgNombre.textContent = "";
                aplicarEstilo(true,inputNombre);
            }
        })
        .catch(error => {
            console.error("Error en la validación del nombre:", error);
            errorMsgNombre.textContent = "Error al validar. Intenta de nuevo.";
            aplicarEstilo(false,inputNombre);
        });
    }


});



/*
console.log(valor.length)
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form-container");
    const codigoInput = document.getElementById("codigo");
    const nombreInput = document.getElementById("nombre");
    const precioInput = document.getElementById("precio");
    const bodegaSelect = document.getElementById("bodega");
    const sucursalSelect = document.getElementById("sucursal");
    const monedaSelect = document.getElementById("moneda");
    const descripcionTextarea = document.getElementById("descripcion");
    const materialesCheckboxes = document.querySelectorAll('input[name="material"]');

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el envío si hay errores

        let errores = [];

        // Validación del Código del Producto
        let codigoValue = codigoInput.value.trim();
        let regexCodigo = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{5,15}$/;
        if (codigoValue === "") {
            errores.push("El código del producto no puede estar en blanco.");
        } else if (!regexCodigo.test(codigoValue)) {
            errores.push("El código del producto debe contener letras y números y tener entre 5 y 15 caracteres.");
        } else {
            // Validar unicidad en la base de datos (se requiere una petición AJAX)
            validarCodigoUnico(codigoValue, function (esUnico) {
                if (!esUnico) {
                    errores.push("El código del producto ya está registrado.");
                    mostrarErrores(errores);
                }
            });
        }

        // Validación del Nombre del Producto
        let nombreValue = nombreInput.value.trim();
        if (nombreValue === "") {
            errores.push("El nombre del producto no puede estar en blanco.");
        } else if (nombreValue.length < 2 || nombreValue.length > 50) {
            errores.push("El nombre del producto debe tener entre 2 y 50 caracteres.");
        }

        // Validación del Precio
        let precioValue = precioInput.value.trim();
        let regexPrecio = /^[0-9]+(\.[0-9]{1,2})?$/;
        if (precioValue === "") {
            errores.push("El precio del producto no puede estar en blanco.");
        } else if (!regexPrecio.test(precioValue) || parseFloat(precioValue) <= 0) {
            errores.push("El precio del producto debe ser un número positivo con hasta dos decimales.");
        }

        // Validación de Materiales (mínimo 2 seleccionados)
        let materialesSeleccionados = Array.from(materialesCheckboxes).filter(chk => chk.checked);
        if (materialesSeleccionados.length < 2) {
            errores.push("Debe seleccionar al menos dos materiales para el producto.");
        }

        // Validación de Bodega (selección obligatoria)
        if (bodegaSelect.value === "") {
            errores.push("Debe seleccionar una bodega.");
        }

        // Validación de Sucursal (selección obligatoria)
        if (sucursalSelect.value === "") {
            errores.push("Debe seleccionar una sucursal para la bodega seleccionada.");
        }

        // Validación de Moneda (selección obligatoria)
        if (monedaSelect.value === "") {
            errores.push("Debe seleccionar una moneda para el producto.");
        }

        // Validación de Descripción
        let descripcionValue = descripcionTextarea.value.trim();
        if (descripcionValue === "") {
            errores.push("La descripción del producto no puede estar en blanco.");
        } else if (descripcionValue.length < 10 || descripcionValue.length > 1000) {
            errores.push("La descripción del producto debe tener entre 10 y 1000 caracteres.");
        }

        // Mostrar errores si existen
        if (errores.length > 0) {
            mostrarErrores(errores);
            return;
        }

        // Si no hay errores, se puede proceder con el envío del formulario
        enviarFormulario();
    });

    function mostrarErrores(errores) {
        alert(errores.join("\n"));
    }

    function validarCodigoUnico(codigo, callback) {
        // Simulación de validación AJAX en la base de datos
        // Reemplazar esto con una llamada real a PHP usando fetch/AJAX
        fetch("validar_codigo.php?codigo=" + encodeURIComponent(codigo))
            .then(response => response.json())
            .then(data => {
                callback(data.unico);
            })
            .catch(error => {
                console.error("Error en la validación del código:", error);
                callback(true);
            });
    }

    function enviarFormulario() {
        alert("Formulario válido. Procediendo con el envío...");
        form.submit();
    }
});


// Carga de valores desde DB
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
    */