// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getDatabase, onValue, ref as refS, set, child, get, update, remove }
    from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5pisgK31mDQnqUSBlccZZTcGPsvgpbLs",
    authDomain: "proyectowebfinal-ee0c5.firebaseapp.com",
    databaseURL: "https://proyectowebfinal-ee0c5-default-rtdb.firebaseio.com",
    projectId: "proyectowebfinal-ee0c5",
    storageBucket: "proyectowebfinal-ee0c5.firebasestorage.app",
    messagingSenderId: "1085156049377",
    appId: "1:1085156049377:web:d437c5151a5cd5dbad12a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



// declarar variables global
var numSerie = 0;
var marca = "";
var modelo = "";
var descripcion = "";
var urlImg = "";

//funciones
function leerInputs() {

    numSerie = document.getElementById('txtNumSerie').value;
    marca = document.getElementById('txtMarca').value;
    modelo = document.getElementById('txtModelo').value;
    descripcion = document.getElementById('txtDescripcion').value;
    urlImg = document.getElementById('txtUrl').value;
}
function mostrarMensaje(mensaje) {
    var mensajeElement = document.getElementById('mensaje');
    mensajeElement.textContent = mensaje;
    mensajeElement.style.display = 'block';
    setTimeout(() => {
        mensajeElement.style.display = 'none'
    }, 1000);
}
//agregar productos
const btnAgregar = document.getElementById('btnAgregar');
btnAgregar.addEventListener('click', insertarProducto);

function insertarProducto() {
    leerInputs();
    //validar
    if (numSerie === "" || marca === "" || modelo === "" || descripcion === "") {
        mostrarMensaje("Faltaron datos por capturar");
        return;
    }
    // funcion firebase para agregar registro
    set(
        refS(db, 'Automoviles/' + numSerie),
        {
            //datos a guardar
            // realizar json con los campos y datos de la tabla
            // campo valor
            numSerie: numSerie,
            marca: marca,
            modelo: modelo,
            descripcion: descripcion,
            urlImg: urlImg
            
        }
    ).then(() => {
        alert("Se agrego con exito");
        Listarproductos();
        limpiarInputs();
    }).catch((error) => {
        alert("Ocurrio un error");
    });
}

function limpiarInputs() {
    document.getElementById('txtNumSerie').value = '';
    document.getElementById('txtModelo').value = '';
    document.getElementById('txtMarca').value = '';
    document.getElementById('txtDescripcion').value = '';
    document.getElementById('txtUrl').value = '';
}

function escribirInputs() {
    document.getElementById('txtModelo').value = modelo;
    document.getElementById('txtMarca').value = marca;
    document.getElementById('txtDescripcion').value = descripcion;
    document.getElementById('txtUrl').value = urlImg;
}

function buscarProducto() {
    let numSerie = document.getElementById('txtNumSerie').value.trim();
    if (numSerie === "") {
        mostrarMensaje("No se ingreso Num Serie");
        return;
    }

    const dbref = refS(db);
    get(child(dbref, 'Automoviles/' + numSerie)).then((snapshot) => {
        if (snapshot.exists()) {
            marca = snapshot.val().marca;
            modelo = snapshot.val().modelo;
            descripcion = snapshot.val().descripcion;
            urlImg = snapshot.val().urlImg;
            escribirInputs();
        } else {
            limpiarInputs();
            mostrarMensaje("El producto con código " + numSerie + " no existe.");
        }
    })
}

const btnBuscar = document.getElementById('btnBuscar');
btnBuscar.addEventListener('click', buscarProducto);

function Listarproductos() {
    const dbRef = refS(db, 'Automoviles/');
    const tabla = document.getElementById('tablaProductos');
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';
    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const data = childSnapshot.val();
            var fila = document.createElement('tr');

            var celdaCodigo = document.createElement('td');
            celdaCodigo.textContent = childKey;
            fila.appendChild(celdaCodigo);

            var celdaNombre = document.createElement('td');
            celdaNombre.textContent = data.marca;
            fila.appendChild(celdaNombre);

            var celdaPrecio = document.createElement('td');
            celdaPrecio.textContent = data.modelo;
            fila.appendChild(celdaPrecio);

            var celdaCantidad = document.createElement('td');
            celdaCantidad.textContent = data.descripcion;
            fila.appendChild(celdaCantidad);

            var celdaImagen = document.createElement('td');
            var imagen = document.createElement('img');
            imagen.src = data.urlImg;
            imagen.width = 100;
            celdaImagen.appendChild(imagen);
            fila.appendChild(celdaImagen);
            tbody.appendChild(fila);
        });
    }, { onlyOnce: true });
}

document.addEventListener("DOMContentLoaded", Listarproductos);

function actualizarAutomovil() {

    leerInputs();
    if (numSerie === "" || marca === "" || modelo === "" || descripcion === "") {
        mostrarMensaje("Favor de capturar toda la informacion");
        return;
    }
    alert("Actualizar");
    update(refS(db, 'Automoviles/' + numSerie), {
        numSerie: numSerie,
        marca: marca,
        modelo: modelo,
        descripcion: descripcion,
        urlImg: urlImg
    }).then(() => {
        mostrarMensaje("Se actualizo con exito.");
        limpiarInputs();
        Listarproductos();
    }).catch((error) => {
        mostrarMensaje("Ocurrio un error: " + error);
    });
}

const btnActualizar = document.getElementById('btnActualizar');
btnActualizar.addEventListener('click', actualizarAutomovil);

function eliminarAutomovil() {
    let numSerie = document.getElementById('txtNumSerie').value.trim();
    if (numSerie === "") {
        mostrarMensaje("No se ingresó un Código válido.");
        return;
    }
    const dbref = refS(db);
    get(child(dbref, 'Automoviles/' + numSerie)).then((snapshot) => {
        if (snapshot.exists()) {
            remove(refS(db, 'Automoviles/' + numSerie))
                .then(() => {
                    mostrarMensaje("Producto eliminado con éxito.");
                    limpiarInputs();
                    Listarproductos();
                })
                .catch((error) => {
                    mostrarMensaje("Ocurrió un error al eliminar el producto: " + error);
                });
        } else {
            limpiarInputs();
            mostrarMensaje("El producto con ID " + numSerie + " no existe.");
        }
    });
    Listarproductos();
}

const btnBorrar = document.getElementById('btnBorrar');
btnBorrar.addEventListener('click', eliminarAutomovil);

// ------------------prueba de la imagen
// cuenta cloudinary
const cloudName = "dk1sj8yj3";
const uploadPreset = "Automoviles";

//constantes
const imageInput = document.getElementById('imageInput');
const uploadButton = document.getElementById('uploadButton');

//evento
uploadButton.addEventListener('click', async (e) => {
    e.preventDefault(); // evita que el formulario se recargue
    e.stopPropagation();

    const file = imageInput.files[0];

    if (!file) {
        alert("Selecciona una imagen antes de subir.");
        return;
    }

    // subir archivo
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if (data.secure_url) {
            document.getElementById("txtUrl").value = data.secure_url;
            alert("Imagen subida correctamente");
        } else {
            alert("Error al subir la imagen");
            console.error(data);
        }
    } catch (error) {
        console.error("Error al subir a Cloudinary:", error);
        alert("Ocurrió un error al subir la imagen.");
    }
});