const url = "https://examenesutn.vercel.app/api/VehiculoAutoCamion";

let arrayVehiculos = [];

document.addEventListener("DOMContentLoaded", function () {
    mostrarListaDeDatos();
    document.getElementById("btnAgregar").addEventListener("click", () => {
        cargarFormAlta();
        llenarEncabezado("Alta");
    });
    document.getElementById("btnCancelar").addEventListener("click", () => {
        ocultarAbmForm();
    });
    document.getElementById("btnAceptar").addEventListener("click", () => {
        controlarBtnAceptar();
    });
    document.getElementById("selectTipo").addEventListener("change", function () {
        modificarPorTipo(this.value);
    });
});

function mostrarListaDeDatos() {
    mostrarSpinner();
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            arrayVehiculos = JSON.parse(xhr.responseText);
            llenarTabla();
            ocultarSpinner();
        }
    };
    xhr.send();
}

function llenarTabla() {
    const tbody = document.getElementById("tablaVehiculos").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    arrayVehiculos.forEach(vehiculo => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${vehiculo.id}</td>
            <td>${vehiculo.modelo}</td>
            <td>${vehiculo.anoFabricacion}</td>
            <td>${vehiculo.velMax}</td>
            <td>${vehiculo.cantidadPuertas || 'N/A'}</td>
            <td>${vehiculo.asientos || 'N/A'}</td>
            <td>${vehiculo.carga || 'N/A'}</td>
            <td>${vehiculo.autonomia || 'N/A'}</td>           
            
            <td>
                <button class="btnModificar" onclick="cargarFormModificar(${vehiculo.id})">Modificar</button>           
            </td>
            <td>
                <button class="btnBorrar" onclick="cargarFormBaja(${vehiculo.id})">Eliminar</button>
            </td>
            `;
        tbody.appendChild(tr);
    });
}

function cargarFormAlta() {
    vaciarAbmForm();
    Array.from(document.querySelectorAll('#formularioAbm input, #formularioAbm select')).forEach(element => {
        element.readOnly = false;
        element.disabled = false;
    });
    document.getElementById("abmId").setAttribute('readonly', true);
    document.getElementById("abmId").setAttribute('disabled', true);
    document.getElementById("formularioAbm").style.display = "block";
    document.getElementById("formularioLista").style.display = "none";
    document.getElementById("btnAceptar2").style.display = 'none';
    document.getElementById("btnAceptar").style.display = 'block';
}

function controlarBtnAceptar() {
    const nuevoVehiculo = getDatos();
    if (nuevoVehiculo) {
        if (!validarDatos(nuevoVehiculo)) {
            return;
        }
        if (nuevoVehiculo.id) {
            modificarVehiculo(nuevoVehiculo);
        } else {
            altaVehiculo(nuevoVehiculo);
        }
    }
}

async function altaVehiculo(vehiculo) {
    mostrarSpinner();
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(vehiculo)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error! No se puede dar alta de vehiculo: ${response.status} ${errorMessage}`);
        }

        const data = await response.json();
        vehiculo.id = data.id;
        arrayVehiculos.push(vehiculo);
        llenarTabla();
        ocultarAbmForm();
    } catch (error) {
        console.error(error);
        ocultarAbmForm();
    } finally {
        ocultarSpinner();
    }
}

function modificarVehiculo(vehiculo) {
    mostrarSpinner();
    fetch(url, {
        method: 'PUT',
        headers:
        {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(vehiculo)
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error(`Error! No se puede modificar este elemento. Error: ${response.status}`);
            }
        })
        .then(data => {
            console.log(data);
        const index = arrayVehiculos.findIndex(v => v.id.toString() == vehiculo.id.toString());
        if (index !== -1) {
            arrayVehiculos[index] = vehiculo;
        }
        llenarTabla();
        ocultarAbmForm();
        })
        .catch(error => {
            alert(error.message);
            ocultarAbmForm();
        })
        .finally(() => {
            ocultarSpinner();
        });
}

function getDatos() {
    const id = document.getElementById("abmId").value;
    const modelo = document.getElementById("abmModelo").value;
    const anoFabricacion = document.getElementById("abmAnoFabricacion").value;
    const velMax = document.getElementById("abmVelMax").value;
    const tipo = document.getElementById("selectTipo").value;
    let vehiculo;

    if (tipo === "Auto") {
        const cantidadPuertas = document.getElementById("abmCantidadPuertas").value;
        const asientos = document.getElementById("abmAsientos").value;
        vehiculo = id ? new Auto(id, modelo, anoFabricacion, velMax, cantidadPuertas, asientos) : new Auto(null, modelo, anoFabricacion, velMax, cantidadPuertas, asientos);
    } else {
        const carga = document.getElementById("abmCarga").value;
        const autonomia = document.getElementById("abmAutonomia").value;
        vehiculo = id ? new Camion(id, modelo, anoFabricacion, velMax, carga, autonomia) : new Camion(null, modelo, anoFabricacion, velMax, carga, autonomia);
    }

    if (!vehiculo.id) {
        delete vehiculo.id;
    }
    return vehiculo;
}

function mostrarSpinner() {
    document.getElementById("spinner").style.display = "block";
    document.getElementById("spinnerContainer").style.display = "flex";
}

function ocultarSpinner() {
    document.getElementById("spinner").style.display = "none";
    document.getElementById("spinnerContainer").style.display = "none";
}

function cargarFormModificar(id) {
    llenarEncabezado("Modificacion");
    const vehiculo = arrayVehiculos.find(v => v.id.toString() == id.toString());
    if (!vehiculo) {
        return;
    }
    document.getElementById("abmId").value = vehiculo.id;
    document.getElementById("abmModelo").value = vehiculo.modelo;
    document.getElementById("abmAnoFabricacion").value = vehiculo.anoFabricacion;
    document.getElementById("abmVelMax").value = vehiculo.velMax;
    document.getElementById("btnAceptar2").style.display = 'none';
    document.getElementById("btnAceptar").style.display = 'block';
    

    Array.from(document.querySelectorAll("#formularioAbm input, #formularioAbm select")).forEach(element => {
        element.readOnly = false;
        element.disabled = false;
    });

    document.getElementById("selectTipo").setAttribute("readonly", true)
    document.getElementById("selectTipo").setAttribute("disabled", true);
    document.getElementById("abmId").setAttribute("readonly", true);
    document.getElementById("abmId").setAttribute("disabled", true);

    if (vehiculo.cantidadPuertas !== undefined) {
        document.getElementById("selectTipo").value = "Auto";
        document.getElementById("abmCantidadPuertas").value = vehiculo.cantidadPuertas;
        document.getElementById("abmAsientos").value = vehiculo.asientos;
        document.getElementById("Camion").style.display = "none";
        document.getElementById("Auto").style.display = "block";
    }
    else {
        document.getElementById("selectTipo").value = "Camion";
        document.getElementById("abmCarga").value = vehiculo.carga;
        document.getElementById("abmAutonomia").value = vehiculo.autonomia;
        document.getElementById("Camion").style.display = "block";
        document.getElementById("Auto").style.display = "none";
    }

    document.getElementById("formularioAbm").style.display = "block";
    document.getElementById("formularioLista").style.display = "none";
}

function llenarEncabezado(modo) {
    document.getElementById("encabezadoAbm").innerHTML = `${modo} de vehiculo`;
}

function ocultarAbmForm() {
    document.getElementById("formularioAbm").style.display = "none";
    document.getElementById("formularioLista").style.display = "block";
}

function vaciarAbmForm() {
    document.getElementById("abmId").value = "";
    document.getElementById("abmModelo").value = "";
    document.getElementById("abmAnoFabricacion").value = "";
    document.getElementById("abmVelMax").value = "";
    document.getElementById("abmCantidadPuertas").value = "";
    document.getElementById("abmAsientos").value = "";
    document.getElementById("abmCarga").value = "";
    document.getElementById("abmAutonomia").value = "";
}

function modificarPorTipo(tipo) {
    if (tipo === "Auto") {
        document.getElementById("Auto").style.display = "block";
        document.getElementById("Camion").style.display = "none";
    } else {
        document.getElementById("Auto").style.display = "none";
        document.getElementById("Camion").style.display = "block";
    }
}

function bajaVehiculo(id) {
    mostrarSpinner();
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                arrayVehiculos = arrayVehiculos.filter(v => v.id.toString() !== id.toString());
                llenarTabla();
            } else {
                alert("Error! No se puede eliminar este elemento. Error: 500");
            }
            ocultarSpinner();
            ocultarAbmForm();
        }
    };
    xhr.send(JSON.stringify({ id: id }));
}

function cargarFormBaja(id) {
    llenarEncabezado("Baja");
    const vehiculo = arrayVehiculos.find(v => v.id.toString() == id.toString());
    if (!vehiculo) return;

    document.getElementById("abmId").value = vehiculo.id;
    document.getElementById("abmModelo").value = vehiculo.modelo;
    document.getElementById("abmAnoFabricacion").value = vehiculo.anoFabricacion;
    document.getElementById("abmVelMax").value = vehiculo.velMax;
    document.getElementById("btnAceptar2").style.display = 'block';
    document.getElementById("btnAceptar").style.display = 'none';
    

    Array.from(document.querySelectorAll('#formularioAbm input, #formularioAbm select')).forEach(element => {
        element.readOnly = true;
        element.disabled = true;
    });

    if (vehiculo.cantidadPuertas !== undefined) {
        document.getElementById("selectTipo").value = "Auto";
        document.getElementById("abmCantidadPuertas").value = vehiculo.cantidadPuertas;
        document.getElementById("abmAsientos").value = vehiculo.asientos;
        document.getElementById("Camion").style.display = "none";
        document.getElementById("Auto").style.display = "block";
    } else {
        document.getElementById("selectTipo").value = "Camion";
        document.getElementById("abmCarga").value = vehiculo.carga;
        document.getElementById("abmAutonomia").value = vehiculo.autonomia;
        document.getElementById("Camion").style.display = "block";
        document.getElementById("Auto").style.display = "none";
    }

    document.getElementById("formularioAbm").style.display = "block";
    document.getElementById("formularioLista").style.display = "none";
    document.getElementById("btnAceptar2").onclick = function () {
        bajaVehiculo(vehiculo.id);
    };
}

function validarDatos(vehiculo) {

    if (vehiculo.modelo !== undefined) {
        if (!vehiculo.modelo) {
            alert("El campo modelo no debe estar vacio.");
            return false;
        }
    }

    if (vehiculo.anoFabricacion !== undefined) {
        if (!vehiculo.anoFabricacion || isNaN(vehiculo.anoFabricacion) || vehiculo.anoFabricacion <= 1985 || vehiculo.anoFabricacion > 2024) {
            alert("El campo Año de Fabricacion debe ser mayor a 1985 y no mayor a 2024.");
            return false;
        }
    }

    if (vehiculo.velMax !== undefined) {
        if (!vehiculo.velMax || isNaN(vehiculo.velMax) || vehiculo.velMax <= 0) {
            alert("El campo Velocidad Maxima debe ser mayor a 0.");
            return false;
        }
    }
    
    if (vehiculo.cantidadPuertas !== undefined) {
        if (!vehiculo.cantidadPuertas || isNaN(vehiculo.cantidadPuertas) || vehiculo.cantidadPuertas <= 2) {
            alert("El campo Cantidad de Puertas debe ser un número mayor a 2.");
            return false;
        }
    }

    if (vehiculo.asientos !== undefined) {
        if (!vehiculo.asientos || isNaN(vehiculo.asientos) || vehiculo.asientos <= 2) {
            alert("El campo Asientos debe ser un número mayor a 2.");
            return false;
        }
    }

    if (vehiculo.carga !== undefined) {
        if (!vehiculo.carga || isNaN(vehiculo.carga) || vehiculo.carga <= 0) {
            alert("El campo Carga debe ser un número mayor a 0.");
            return false;
        }
    }

    if (vehiculo.autonomia !== undefined) {
        if (!vehiculo.autonomia || isNaN(vehiculo.autonomia) || vehiculo.autonomia <= 0) {
            alert("El campo Autonomia debe ser un número mayor a 0.");
            return false;
        }
    }

    return true;
}