var http = new XMLHttpRequest();
var httpPost = new XMLHttpRequest();


window.onload = function () {
    pedirMateriasGet();

}

//#region GET
function realizarPeticionGet(url, metodo, funcion) {
    http.onreadystatechange = funcion;
    http.open(metodo, url, true);
    http.send();
}

function pedirMateriasGet() {
    realizarPeticionGet("http://localhost:3000/materias", "GET", callback);
}

function traerMaterias(jsonObj) {

    for (var materia of jsonObj) {
        agregarFilaMateria(materia.id, materia.nombre, materia.cuatrimestre, materia.fechaFinal, materia.turno);
    }
}

function callback() {
    if (http.readyState === 4 && http.status === 200) {
        listaJson = JSON.parse(http.responseText);
        traerMaterias(listaJson);
        
    }
}

//#endregion

//#region POST

function modificarMateria(id, nuevoNombre, nuevoCuatrimestre, nuevaFecha, nuevoTurno) {
    httpPost.onreadystatechange = callbackPost;
    httpPost.open("POST", "http://localhost:3000/editar", true);
    httpPost.setRequestHeader("Content-Type", "application/json");
    document.getElementById("container-spinner").style.display = "flex";

    var datos = {
        id: id,
        nombre: nuevoNombre,
        cuatrimestre: nuevoCuatrimestre,
        fechaFinal: nuevaFecha,
        turno: nuevoTurno
    };
    httpPost.send(JSON.stringify(datos));
}

function eliminarPersona(id) {
    httpPost.onreadystatechange = callbackPost;
    httpPost.open("POST", "http://localhost:3000/eliminar", true);
    httpPost.setRequestHeader("Content-Type", "application/json");
    document.getElementById("container-spinner").style.display = "flex";

    var datos = {
        id: id,
    };
    httpPost.send(JSON.stringify(datos));
}

function callbackPost() {
    document.getElementById("container-spinner").style.display = "none";
    if (httpPost.readyState == 4) {
        //alert("entro al 4");
        if (httpPost.status == 200) {
            //alert("entro al 200");
            alert(httpPost.responseText);
        }
    }
}

//#endregion

function agregarFilaMateria(id, nombre, cuatrimestre, fechaFinal, turno) {
    tCuerpo = document.getElementById("tCuerpo");

    var tr = document.createElement("tr");
    tr.setAttribute("id", id);

    var tdNombre = document.createElement("td");
    var nodoTexto = document.createTextNode(nombre);
    tdNombre.appendChild(nodoTexto);
    tr.appendChild(tdNombre);

    var tdCuatrimestre = document.createElement("td");
    var nodoTexto = document.createTextNode(cuatrimestre);
    tdCuatrimestre.appendChild(nodoTexto);
    tr.appendChild(tdCuatrimestre);

    var tdFechaFinal = document.createElement("td");
    var nodoTexto = document.createTextNode(fechaFinal);
    tdFechaFinal.appendChild(nodoTexto);
    tr.appendChild(tdFechaFinal);

    var tdTurno = document.createElement("td");
    var nodoTexto = document.createTextNode(turno);
    tdTurno.appendChild(nodoTexto);
    tr.appendChild(tdTurno);

    tr.addEventListener("dblclick", clickGrilla);
    tCuerpo.appendChild(tr);
}


//#region funciones abrir y cerrar

function clickGrilla(evento) {
    var trClick = evento.target.parentNode;
    var backdrop = document.getElementById("backdrop");
    var modal = document.getElementById("container-modificar");
    backdrop.addEventListener("click", cerrarGrilla);
    modal.addEventListener("click", modalClick);
    
    var modificar = document.getElementById("btnModificar");
    var eliminar = document.getElementById("btnEliminar");
    limpiarError();


    var id = trClick.getAttribute("id");

    document.getElementById("nombreMod").value = trClick.childNodes[0].innerHTML;

    var cuatrimestre = trClick.childNodes[1].innerHTML;
    document.getElementById("cuatrimestreMod").disabled = true;
    switch (cuatrimestre) {
        case "1":
            document.getElementById("primerCuatri").selected = true;
        break;
        case "2":
            document.getElementById("segundoCuatri").selected = true;
        break;
        case "3":
            document.getElementById("tercerCuatri").selected = true;
        break;
        case "4":
            document.getElementById("cuartoCuatri").selected = true;
        break;
    }

    fechaMod.min = new Date().toISOString().split("T")[0];
    fechaSinFormato = trClick.childNodes[2].innerHTML;
    fechaSplit = fechaSinFormato.split("/");
    fechaConFormato = fechaSplit[2]+"-"+fechaSplit[1]+"-"+fechaSplit[0];
    document.getElementById("fechaMod").value = fechaConFormato;
    

    var turno = trClick.childNodes[3].innerHTML;
    if (turno == "Mañana") {
        document.getElementById("maniana").checked = true;
    } else {
        document.getElementById("noche").checked = true;
    }
    backdrop.style.display = "flex";


    modificar.onclick = function () {
        var nuevoNombre = document.getElementById("nombreMod").value;
        nuevoNombre = nuevoNombre.charAt(0).toUpperCase() + nuevoNombre.slice(1);

        nuevaFechaSinFormato = document.getElementById("fechaMod").value;
        nuevaFechaSplit = nuevaFechaSinFormato.split("-");
        nuevaFechaConFormato = nuevaFechaSplit[2]+"/"+nuevaFechaSplit[1]+"/"+nuevaFechaSplit[0];


        var nuevoTurno = document.querySelector('input[name="turnoMod"]:checked').value;

        if (nuevoTurno == 0) {
            nuevoTurno = "Mañana";
        } else {
            nuevoTurno = "Noche";
        }

        if (nuevoNombre.length > 6) {

            modificarMateria(id, nuevoNombre, cuatrimestre, nuevaFechaConFormato, nuevoTurno);

            trClick.childNodes[0].innerHTML = nuevoNombre;
            trClick.childNodes[1].innerHTML = cuatrimestre;
            trClick.childNodes[2].innerHTML = nuevaFechaConFormato;
            trClick.childNodes[3].innerHTML = nuevoTurno;

            cerrarGrilla();
        }
        if (nuevoNombre.length < 7) {
            document.getElementById("nombreMod").classList.add("error");
        }

    }

    eliminar.onclick = function () {
        eliminarPersona(id);
        cerrarGrilla();
        
        while(trClick.hasChildNodes){
            trClick.removeChild(trClick.childNodes[0]);
        }

    }

}

function limpiarError () {
    document.getElementById("nombreMod").classList.remove("error");
}

function modalClick(evento) {
    evento.stopPropagation();
}

function cerrarGrilla() {
    var backdrop = document.getElementById("backdrop");
    backdrop.style.display = "none";

}

//#endregion