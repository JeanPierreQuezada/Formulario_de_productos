import CONFIG from './config.js';

// Validación del campo Código
document.addEventListener("DOMContentLoaded", function () {
    const inputCodigo = document.getElementById("codigo");
    const inputNombre = document.getElementById("nombre");
    const inputPrecio = document.getElementById("precio");
    const inputDescripcion = document.getElementById("descripcion");

    const errorMsg = document.getElementById("msg-codigo");
    const errorMsgNombre = document.getElementById("msg-nombre");
    const errorMsgPrecio = document.getElementById("msg-precio");
    const errorMsgDescripcion = document.getElementById("msg-descripcion");
    const errorMsgMaterial = document.getElementById("msg-materiales");

    const botonGuardar = document.getElementById("guardar");

    let valorTest;

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

    // Listener Precio
    inputPrecio.addEventListener("focus", function () {
        validarPrecio();
    });

    inputPrecio.addEventListener("input", function () {
        validarPrecio();
    });

    // Listener Descripción
    inputDescripcion.addEventListener("focus", function () {
        validarDescripcion();
    });

    inputDescripcion.addEventListener("input", function () {
        validarDescripcion();
    });

    // Listener Enviar
    botonGuardar.addEventListener("click", async function (event) {
        event.preventDefault();
        let checkboxes = document.querySelectorAll('input[name="material"]:checked');
        let valores = Array.from(checkboxes).map(checkbox => checkbox.value);

        if (!validarMateriales(valores)) {
            console.error("Error: Debes seleccionar al menos dos materiales.");
            return;
        }

        try {
            await Promise.all([
                valorTest = validarCodigoBackend(inputCodigo.value),
                validarNombreBackend(inputNombre.value),
                validarPrecioBackend(inputPrecio.value),
                validarDescripcionBackend(inputDescripcion.value),
                validarMaterialesBackend(valores)
            ]);
    
            console.log("Todas las validaciones se completaron correctamente.");
        } catch (error) {
            console.error("Error en una o más validaciones:", error);
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
            aplicarEstilo(false,inputCodigo);
            return false;
        } else if (!regex.test(valor)) {
            errorMsg.textContent = "El código del producto solo debe contener letras y números";
            aplicarEstilo(false,inputCodigo);
            return false;
        } else if (valor.length < 5 || valor.length > 15) {
            errorMsg.textContent = "El código del producto debe tener entre 5 y 15 caracteres";
            aplicarEstilo(false,inputCodigo);
            return false;
        } else {
            errorMsg.textContent = "";
            aplicarEstilo(true,inputCodigo);
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
                console.log(data)
                aplicarEstilo(true,inputCodigo);
                return data.estado;
            }
        })
        .catch(error => {
            console.error("Error en la validación del código:", error);
            errorMsg.textContent = "Error al validar. Intenta de nuevo.";
            aplicarEstilo(false);
        });
        console.log(valorTest);
    }

    console.log(valorTest);

    // Nombre
    function validarNombre() {
        const valor = inputNombre.value.trim();
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]+$/;

        if (valor.length === 0) {
            errorMsgNombre.textContent = "El nombre del producto no puede estar en blanco";
            aplicarEstilo(false,inputNombre);
            return false;
        } else if (!regex.test(valor)) {
            errorMsgNombre.textContent = "El nombre del producto solo debe contener letras.";
            aplicarEstilo(false,inputNombre);
            return false;
        } else if (valor.length < 2 || valor.length > 50) {
            errorMsgNombre.textContent = "El nombre del producto debe tener entre 5 y 50 caracteres";
            aplicarEstilo(false,inputNombre);
            return false;
        } else {
            errorMsgNombre.textContent = "";
            aplicarEstilo(true,inputNombre);
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
                console.log(data.estado)
                aplicarEstilo(true,inputNombre);
            }
        })
        .catch(error => {
            console.error("Error en la validación del nombre:", error);
            errorMsgNombre.textContent = "Error al validar. Intenta de nuevo.";
            aplicarEstilo(false,inputNombre);
        });
    }

    // Precio
    function validarPrecio() {
        const valor = inputPrecio.value.trim();
        const regex = /^\d+(\.\d{1,2})?$/;

        if (valor.length === 0) {
            errorMsgPrecio.textContent = "El precio del producto no debe quedar en blanco";
            aplicarEstilo(false,inputPrecio);
            return false;
        } else if (!regex.test(valor)) {
            errorMsgPrecio.textContent = "Sólo números positivos con hasta dos decimales";
            aplicarEstilo(false,inputPrecio);
            return false;
        } else {
            errorMsgPrecio.textContent = "";
            aplicarEstilo(true,inputPrecio);
            return true;
        }
    }

    function validarPrecioBackend(nombre) {
        fetch(`${CONFIG.API_BASE_URL}validar_precio.php?precio=` + encodeURIComponent(nombre))
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                errorMsgPrecio.textContent = data.error;
                aplicarEstilo(false,inputPrecio);
                return;
            } else {
                errorMsgPrecio.textContent = "";
                aplicarEstilo(true,inputPrecio);
            }
        })
        .catch(error => {
            console.error("Error en la validación del nombre:", error);
            errorMsgPrecio.textContent = "Error al validar. Intenta de nuevo.";
            aplicarEstilo(false,inputPrecio);
        });
    }

    // Descripción
    function validarDescripcion() {
        const valor = inputDescripcion.value.trim();
        const regex = /^.{10,1000}$/;

        if (valor.length === 0) {
            errorMsgDescripcion.textContent = "La descripcion del producto no debe quedar en blanco";
            aplicarEstilo(false,inputDescripcion);
            return false;
        } else if (!regex.test(valor)) {
            errorMsgDescripcion.textContent = "Se permiten entre 10 a 1000 caracteres";
            aplicarEstilo(false,inputDescripcion);
            return false;
        } else {
            errorMsgDescripcion.textContent = "";
            aplicarEstilo(true,inputDescripcion);
            return true;
        }
    }

    function validarDescripcionBackend(nombre) {
        fetch(`${CONFIG.API_BASE_URL}validar_descripcion.php?descripcion=` + encodeURIComponent(nombre))
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                errorMsgDescripcion.textContent = data.error;
                aplicarEstilo(false,inputDescripcion);
                return;
            } else {
                errorMsgDescripcion.textContent = "";
                aplicarEstilo(true,inputDescripcion);
            }
        })
        .catch(error => {
            console.error("Error en la validación del nombre:", error);
            errorMsgDescripcion.textContent = "Error al validar. Intenta de nuevo.";
            aplicarEstilo(false,inputDescripcion);
        });
    }

    // Materiales
    function validarMateriales(valores) {
        console.log(valores)
        if (valores.length < 2) {
            errorMsgMaterial.textContent = "Debes seleccionar al menos dos materiales.";
            return false;
        } else {
            errorMsgMaterial.textContent = "";
            return valores;
        }
    }

    function validarMaterialesBackend(valores) {
        fetch(`${CONFIG.API_BASE_URL}validar_descripcion.php?descripcion=` + encodeURIComponent(nombre))
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                errorMsgDescripcion.textContent = data.error;
                return;
            } else {
                errorMsgDescripcion.textContent = "";
                return data.valor;
            }
        })
        .catch(error => {
            console.error("Error en la validación del nombre:", error);
            errorMsgDescripcion.textContent = "Error al validar. Intenta de nuevo.";
            aplicarEstilo(false,inputDescripcion);
        });
    }
});