import CONFIG from './config.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formProducto");
    const btnEnviar = document.getElementById("guardar");
    const inputFields = ["codigo", "nombre", "precio", "descripcion"];
    const selectFields = ["bodega", "sucursal", "moneda"];
    const checkboxes = document.querySelectorAll('input[name="material"]');
    const bodegaSelect = document.getElementById("bodega");
    const sucursalSelect = document.getElementById("sucursal");
    const monedaSelect = document.getElementById("moneda");
    const errorMsgMaterial = document.getElementById("msg-materiales");
    const errorMsgSelect = {
        bodega: document.getElementById("msg-bodega"),
        sucursal: document.getElementById("msg-sucursal"),
        moneda: document.getElementById("msg-moneda")
    };
    
    let validFields = {};
    let timeoutId;
    
    inputFields.forEach(id => {
        const input = document.getElementById(id);
        validFields[id] = false;
        input.addEventListener("input", () => debounce(() => validateInput(id), 1500));
    });
    
    selectFields.forEach(id => {
        const select = document.getElementById(id);
        validFields[id] = false;
        select.addEventListener("change", () => validateSelect(id));
    });
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", validateMaterials);
    });

    function debounce(callback, delay) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(callback, delay);
    }

    function validateInput(field) {
        const input = document.getElementById(field);
        const value = input.value.trim();
        let isValid = false;
        const errorMsg = document.getElementById(`msg-${field}`);

        const rules = {
            codigo: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/,
            nombre: /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]{2,50}$/,
            precio: /^\d+(\.\d{1,2})?$/,
            descripcion: /^.{10,1000}$/
        };

        if (!value) {
            errorMsg.textContent = `El campo ${field} no puede estar vacío`;
            isValid = false;
        } else if (!rules[field].test(value)) {
            errorMsg.textContent = `Formato incorrecto para ${field}`;
            isValid = false;
        } else {
            errorMsg.textContent = "";
            isValid = true;
            validateBackend(field, value);
        }

        input.classList.toggle("valid", isValid);
        input.classList.toggle("error", !isValid);
        validFields[field] = isValid;
        checkFormValidity();
    }
    
    function validateBackend(field, value) {
        console.log(`Validando ${field} en backend...`);
        fetch(`${CONFIG.API_BASE_URL}validar_${field}.php?${field}=` + encodeURIComponent(value))
            .then(response => response.json())
            .then(data => {
                validFields[field] = !data.error && (field !== 'codigo' || data.unico);
                console.log(`${field} validado en backend:`, validFields[field]);
                checkFormValidity();
            })
            .catch(error => console.error(`Error en validación de ${field}:`, error));
    }
    
    function validateMaterials() {
        const selected = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
        validFields["materiales"] = selected.length >= 2;
        
        if (validFields["materiales"]) {
            errorMsgMaterial.textContent = "";
            validateMaterialsBackend(selected);
        } else {
            errorMsgMaterial.textContent = "Debe seleccionar al menos dos materiales.";
        }
        checkFormValidity();
    }

    function validateMaterialsBackend(selectedMaterials) {
        console.log("Validando materiales en backend...");
        fetch(`${CONFIG.API_BASE_URL}validar_materiales.php?materiales=` + encodeURIComponent(selectedMaterials.join(",")))
            .then(response => response.json())
            .then(data => {
                validFields["materiales"] = !data.error;
                console.log("Materiales validado en backend:", validFields["materiales"]);
                if (!validFields["materiales"]) {
                    console.log("Error en la validación de materiales.");
                }
                checkFormValidity();
            })
            .catch(error => {
                console.error("Error en validación de materiales:", error);
            });
    }

    function validateSelect(field) {
        const select = document.getElementById(field);
        validFields[field] = select.value !== "";
        
        if (validFields[field]) {
            errorMsgSelect[field].textContent = "";
            select.classList.add("valid");
            select.classList.remove("error");
        } else {
            errorMsgSelect[field].textContent = `Debe seleccionar una opción para ${field}.`;
            select.classList.add("error");
            select.classList.remove("valid");
        }
        checkFormValidity();
    }

    function loadBodegas() {
        fetch(`${CONFIG.API_BASE_URL}get_bodegas.php`)
            .then(response => response.json())
            .then(data => {
                data.bodegas.forEach(bodega => {
                    let option = document.createElement("option");
                    option.value = bodega.id;
                    option.textContent = bodega.nombre;
                    bodegaSelect.appendChild(option);
                });
            })
            .catch(error => console.error("Error al obtener bodegas:", error));
    }
    
    function loadSucursales(bodegaId) {
        fetch(`${CONFIG.API_BASE_URL}get_sucursales.php?bodega_id=${bodegaId}`)
            .then(response => response.json())
            .then(data => {
                sucursalSelect.innerHTML = '<option value="">Seleccione una opción</option>';
                data.sucursales.forEach(sucursal => {
                    let option = document.createElement("option");
                    option.value = sucursal.id;
                    option.textContent = sucursal.nombre;
                    sucursalSelect.appendChild(option);
                });
                sucursalSelect.disabled = false;
            })
            .catch(error => console.error("Error al obtener sucursales:", error));
    }
    
    function loadMonedas() {
        fetch(`${CONFIG.API_BASE_URL}get_monedas.php`)
            .then(response => response.json())
            .then(data => {
                data.monedas.forEach(moneda => {
                    let option = document.createElement("option");
                    option.value = moneda.id;
                    option.textContent = moneda.nombre;
                    monedaSelect.appendChild(option);
                });
            })
            .catch(error => console.error("Error al obtener monedas:", error));
    }

    function checkFormValidity() {
        const allValid = Object.values(validFields).every(value => value !== "" && value !== null);
        if (allValid) {
            btnEnviar.textContent = "Guardar Producto";
            btnEnviar.disabled = false;
            btnEnviar.style.cursor = "pointer";
        } else {
            btnEnviar.textContent = "Validando ...";
            btnEnviar.disabled = true;
            btnEnviar.style.cursor = "not-allowed";
        }
        console.log("Estado del formulario:", validFields);
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!btnEnviar.disabled) {
            btnEnviar.textContent = "Procesando ...";
            fetch(`${CONFIG.API_BASE_URL}agregar_producto.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.fromEntries(new FormData(form)))
            })
            .then(response => response.json())
            .then(data => {
                alert(data.success ? "Producto agregado exitosamente" : `Error: ${data.error}`);
                console.log(data.success ? "Producto guardado con éxito" : "Error al guardar el producto", data);
                if (data.success) form.reset();
                btnEnviar.textContent = "Guardar Producto";
                checkFormValidity();
            })
            .catch(error => {
                console.error("Error al agregar producto:", error);
                btnEnviar.textContent = "Guardar Producto";
            });
        }
    });
    
    bodegaSelect.addEventListener("change", () => loadSucursales(bodegaSelect.value));
    
    loadBodegas();
    loadMonedas();
    checkFormValidity();
});