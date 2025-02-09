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
    let sucursalTouched = false;
    
    let validFields = {};
    let debounceTimers = new Map();

    inputFields.forEach(id => {
        const input = document.getElementById(id);
        validFields[id] = false;
        input.addEventListener("input", () => debounce(id, () => validateInput(id), 500));
    });

    selectFields.forEach(id => {
        const select = document.getElementById(id);
        validFields[id] = false;
        select.addEventListener("change", () => validateSelect(id));
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", validateMaterials);
    });

    function debounce(field, callback, delay) {
        if (debounceTimers.has(field)) {
            clearTimeout(debounceTimers.get(field));
        }
        const timer = setTimeout(callback, delay);
        debounceTimers.set(field, timer);
    }

    function validateInput(field) {
        const input = document.getElementById(field);
        const value = input.value.trim();
        const errorMsg = document.getElementById(`msg-${field}`);

        const rules = {
            codigo: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/,
            nombre: /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]{2,50}$/,
            precio: /^\d+(\.\d{1,2})?$/,
            descripcion: /^.{10,1000}$/
        };

        const mensajes = { 
            codigo: "El código debe contener al menos una letra y un número.",
            nombre: "El nombre debe contener entre 2 y 50 caracteres y solo letras.",
            precio: "El precio debe ser un número válido con hasta dos decimales.",
            descripcion: "La descripción debe tener entre 10 y 1000 caracteres."
        };

        if (!value) {
            errorMsg.textContent = `El campo ${field} no puede estar vacío`;
            validFields[field] = false;
            updateUI(field, false);
            return;
        }

        if (!rules[field].test(value)) {
            errorMsg.textContent = `${mensajes[field]}`;
            validFields[field] = false;
            updateUI(field, false);
            return;
        }

        errorMsg.textContent = "Validando...";
        input.classList.remove("valid", "error");

        validateBackend(field, value);
    }

    async function validateBackend(field, value) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}validar_${field}.php?${field}=` + encodeURIComponent(value));
            const data = await response.json();
            
            validFields[field] = !data.error && (field !== 'codigo' || data.unico);
            updateUI(field, validFields[field]);
        } catch (error) {
            console.error(`Error en validación de ${field}:`, error);
            validFields[field] = false;
            updateUI(field, false);
        }
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

        validateMaterialsBackend(selected);
    }

    async function validateMaterialsBackend(selectedMaterials) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}validar_materiales.php?materiales=` + encodeURIComponent(selectedMaterials.join(",")));
            const data = await response.json();
            validFields["materiales"] = !data.error;
            checkFormValidity();
        } catch (error) {
            console.error("Error en validación de materiales:", error);
        }
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
                sucursalSelect.innerHTML = '<option value="">Seleccione una opción</option>';
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
        if (!bodegaId) {
            sucursalSelect.innerHTML = '<option value="">Seleccione una opción</option>';
            sucursalSelect.disabled = true;
            return;
        }

        fetch(`${CONFIG.API_BASE_URL}get_sucursales.php?bodega_id=${bodegaId}`)
            .then(response => response.json())
            .then(data => {
                sucursalSelect.innerHTML = '<option value="">Seleccione una opción</option>';

                if (Array.isArray(data.sucursales)) {
                    data.sucursales.forEach(sucursal => {
                        let option = document.createElement("option");
                        option.value = sucursal.id;
                        option.textContent = sucursal.nombre;
                        sucursalSelect.appendChild(option);
                    });
                    sucursalSelect.disabled = false;
                } else {
                    sucursalSelect.disabled = true;
                }
            })
            .catch(error => {
                console.error("Error al obtener sucursales:", error);
                sucursalSelect.innerHTML = '<option value="">Seleccione...</option>';
                sucursalSelect.disabled = true;
            });
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

    function updateUI(field, isValid) {
        const element = document.getElementById(field);
        const errorMsg = document.getElementById(`msg-${field}`);
        
        if (isValid) {
            element.classList.add("valid");
            element.classList.remove("error");
            errorMsg.textContent = "";
        } else {
            element.classList.add("error");
            element.classList.remove("valid");
        }
        
        checkFormValidity();
    }

    function checkFormValidity() {
        const allValid = Object.values(validFields).every(value => value === true);
        btnEnviar.disabled = !allValid;
        //btnEnviar.textContent = allValid ? "Guardar Producto" : "Validando...";
        if (!allValid){
            btnEnviar.classList.add("disabledButton");
            btnEnviar.style.cursor = "not-allowed";
        } else {
            btnEnviar.classList.remove("disabledButton");
            btnEnviar.style.cursor = "pointer";
        }
        console.log("Estado del formulario:", validFields);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!btnEnviar.disabled) {
            btnEnviar.textContent = "Procesando ...";
            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}agregar_producto.php`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(Object.fromEntries(new FormData(form)))
                });

                const data = await response.json();
                alert(data.success ? "Producto agregado exitosamente" : `Error: ${data.error}`);

                if (data.success) form.reset();
                btnEnviar.textContent = "Guardar Producto";
                checkFormValidity();
            } catch (error) {
                console.error("Error al agregar producto:", error);
                btnEnviar.textContent = "Guardar Producto";
            }
        }
    });

    bodegaSelect.addEventListener("change", () => {
        validFields["sucursal"] = false;
        sucursalSelect.innerHTML = '<option value="">Seleccione una opción</option>';
        sucursalSelect.disabled = true;
        errorMsgSelect["sucursal"].textContent = "";
        checkFormValidity();

        if (sucursalTouched) { 
            validateSelect("sucursal");
        }

        loadSucursales(bodegaSelect.value);
    });

    sucursalSelect.addEventListener("change", () => {
        sucursalTouched = true;
    });

    loadBodegas();
    loadMonedas();
    checkFormValidity();
});