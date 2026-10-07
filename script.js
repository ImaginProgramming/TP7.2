let cajaAlumnos = document.getElementById("resultado-estudiantes");
let cajaProfesores = document.getElementById("resultado-docentes");
let cajaCursoDocentes = document.getElementById("curso-docentes");
let cajaCursoEstudiantes = document.getElementById("curso-estudiantes");

if(cajaAlumnos) mostrarAlumnos();
if(cajaProfesores) mostrarProfesores();
if(cajaCursoDocentes) buscarPorCurso();

function obtenerDatos(clave){
    return JSON.parse(localStorage.getItem(clave)) || [];
}

function guardarDatos(clave, valor){
    localStorage.setItem(clave, JSON.stringify(valor));
}

function limpiarFormularioEstudiante(){
    document.getElementById("nombre").value = "";
    document.getElementById("edad").value = "";
}

function limpiarFormularioDocente(){
    document.getElementById("doc-nombre").value = "";
    document.getElementById("doc-especialidad").value = "";
}

function guardar_estudiante(){
    let nombre = document.getElementById("nombre").value;
    let edad = document.getElementById("edad").value;
    let curso = document.getElementById("curso").value;

    if(nombre == ""){
        alert("Falta completar el nombre del estudiante");
        return;
    }

    if(edad == ""){
        alert("Falta completar la edad del estudiante");
        return;
    }

    let alumnos = obtenerDatos("lista_estudiantes");
    let nuevoAlumno = {
        nombre: nombre,
        edad: edad,
        curso: curso,
        notas: []
    };

    alumnos.push(nuevoAlumno);
    guardarDatos("lista_estudiantes", alumnos);
    alert("El estudiante se registro correctamente");

    let panelUltimo = document.getElementById("ultimo-ingresado");
    if(panelUltimo){
        panelUltimo.innerHTML = "<div class='ficha'>" +
            "<h2>Nombre: " + nombre + "</h2>" +
            "<h3>Edad: " + edad + "</h3>" +
            "<h3>Curso: " + curso + "</h3>" +
            "</div>";
    }

    limpiarFormularioEstudiante();
}

function mostrarAlumnos(){
    let alumnos = obtenerDatos("lista_estudiantes");
    cajaAlumnos.innerHTML = "";

    if(alumnos.length == 0){
        cajaAlumnos.innerHTML = "<p>Todavia no hay estudiantes registrados.</p>";
        return;
    }

    for(let i = 0; i < alumnos.length; i++){
        let alumno = alumnos[i];

        let suma = 0;
        let promedio = 0;
        for(let j = 0; j < alumno.notas.length; j++){
            suma += alumno.notas[j];
        }
        if(alumno.notas.length > 0){
            promedio = suma / alumno.notas.length;
        }

        let estado = "Sin notas";
        if(alumno.notas.length > 0){
            if(promedio >= 6){
                estado = "Aprobado";
            } else {
                estado = "Desaprobado";
            }
        }

        cajaAlumnos.innerHTML += "<div class='ficha'>" +
            "<h2>Nombre: " + alumno.nombre + "</h2>" +
            "<h3>Edad: " + alumno.edad + "</h3>" +
            "<h3>Curso: " + alumno.curso + "</h3>" +
            "<h3>Notas: " + (alumno.notas.length ? alumno.notas.join(", ") : "Sin notas") + "</h3>" +
            "<h3>Promedio: " + promedio.toFixed(2) + "</h3>" +
            "<h3>Condicion: " + estado + "</h3>" +
            "<label>Nueva nota:</label>" +
            "<input type='number' id='nota" + i + "'>" +
            "<button type='button' onclick='guardarNota(" + i + ")'>Guardar</button>" +
            "<button type='button' class='btn-eliminar' onclick='borrarEstudiante(" + i + ")'>Borrar Estudiante</button>" +
            "</div>";
    }
}

function guardarNota(posicion){
    let alumnos = obtenerDatos("lista_estudiantes");
    let nota = parseFloat(document.getElementById("nota" + posicion).value);

    if(nota >= 1 && nota <= 10){
        alumnos[posicion].notas.push(nota);
        guardarDatos("lista_estudiantes", alumnos);
        alert("Nota agregada");
        mostrarAlumnos();
    } else {
        alert("La nota tiene que estar entre 1 y 10");
    }
}

function borrarEstudiante(posicion){
    let alumnos = obtenerDatos("lista_estudiantes");
    alumnos.splice(posicion, 1);
    guardarDatos("lista_estudiantes", alumnos);
    alert("Estudiante eliminado");
    if(cajaAlumnos) mostrarAlumnos();
    if(cajaCursoEstudiantes) buscarPorCurso();
}

function guardar_docente(){
    let nombre = document.getElementById("doc-nombre").value;
    let especialidad = document.getElementById("doc-especialidad").value;

    if(nombre == ""){
        alert("Falta completar el nombre del docente");
        return;
    }

    if(especialidad == ""){
        alert("Falta completar la especialidad del docente");
        return;
    }

    let profesores = obtenerDatos("lista_docentes");
    let nuevoProfesor = {
        nombre: nombre,
        especialidad: especialidad,
        cursos: []
    };

    profesores.push(nuevoProfesor);
    guardarDatos("lista_docentes", profesores);
    alert("El docente se registro correctamente");

    let panelUltimo = document.getElementById("ultimo-docente");
    if(panelUltimo){
        panelUltimo.innerHTML = "<div class='ficha'>" +
            "<h2>Docente: " + nombre + "</h2>" +
            "<h3>Especialidad: " + especialidad + "</h3>" +
            "<h3>Cursos: Sin cursos asignados</h3>" +
            "</div>";
    }

    limpiarFormularioDocente();
}

function mostrarProfesores(){
    let profesores = obtenerDatos("lista_docentes");
    cajaProfesores.innerHTML = "";

    if(profesores.length == 0){
        cajaProfesores.innerHTML = "<p>Todavia no hay docentes registrados.</p>";
        return;
    }

    for(let i = 0; i < profesores.length; i++){
        let profesor = profesores[i];
        let cursosTexto = profesor.cursos.length > 0 ? profesor.cursos.join(", ") : "Sin asignar";

        cajaProfesores.innerHTML += "<div class='ficha'>" +
            "<h2>Docente: " + profesor.nombre + "</h2>" +
            "<h3>Especialidad: " + profesor.especialidad + "</h3>" +
            "<h3>Cursos: " + cursosTexto + "</h3>" +
            "<label>Asignar curso:</label>" +
            "<select id='sel-curso-" + i + "'>" +
                "<option value='1ro'>1ro</option>" +
                "<option value='2do'>2do</option>" +
                "<option value='3ro'>3ro</option>" +
                "<option value='4to'>4to</option>" +
                "<option value='5to'>5to</option>" +
                "<option value='6to'>6to</option>" +
                "<option value='7mo'>7mo</option>" +
            "</select>" +
            "<button type='button' onclick='asignarCurso(" + i + ")'>Asignar</button>" +
            "<button type='button' class='btn-eliminar' onclick='borrarDocente(" + i + ")'>Borrar Docente</button>" +
            "</div>";
    }
}

function asignarCurso(posicion){
    let profesores = obtenerDatos("lista_docentes");
    let cursoElegido = document.getElementById("sel-curso-" + posicion).value;

    if(!profesores[posicion].cursos.includes(cursoElegido)){
        profesores[posicion].cursos.push(cursoElegido);
        guardarDatos("lista_docentes", profesores);
        alert("Curso asignado al docente");
        mostrarProfesores();
    } else {
        alert("Ese curso ya estaba asignado a este docente");
    }
}

function borrarDocente(posicion){
    let profesores = obtenerDatos("lista_docentes");
    profesores.splice(posicion, 1);
    guardarDatos("lista_docentes", profesores);
    alert("Docente eliminado");
    if(cajaProfesores) mostrarProfesores();
    if(cajaCursoDocentes) buscarPorCurso();
}

function buscarPorCurso(){
    let cursoElegido = document.getElementById("filtro-curso").value;
    let alumnos = obtenerDatos("lista_estudiantes");
    let profesores = obtenerDatos("lista_docentes");

    cajaCursoDocentes.innerHTML = "";
    cajaCursoEstudiantes.innerHTML = "";

    for(let i = 0; i < profesores.length; i++){
        let p = profesores[i];
        if(p.cursos && p.cursos.includes(cursoElegido)){
            cajaCursoDocentes.innerHTML += "<div class='ficha'>" +
                "<h2>" + p.nombre + "</h2>" +
                "<h3>" + p.especialidad + "</h3>" +
                "<button type='button' class='btn-eliminar' onclick='borrarDocente(" + i + ")'>Borrar</button>" +
                "</div>";
        }
    }

    if(cajaCursoDocentes.innerHTML == ""){
        cajaCursoDocentes.innerHTML = "<p>No hay docentes en este curso.</p>";
    }

    for(let i = 0; i < alumnos.length; i++){
        let a = alumnos[i];
        if(a.curso == cursoElegido){
            cajaCursoEstudiantes.innerHTML += "<div class='ficha'>" +
                "<h2>" + a.nombre + "</h2>" +
                "<h3>Edad: " + a.edad + "</h3>" +
                "<button type='button' class='btn-eliminar' onclick='borrarEstudiante(" + i + ")'>Borrar</button>" +
                "</div>";
        }
    }

    if(cajaCursoEstudiantes.innerHTML == ""){
        cajaCursoEstudiantes.innerHTML = "<p>No hay estudiantes en este curso.</p>";
    }
}