import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, onValue, ref as refS, set, child, get, update, remove }
    from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA5pisgK31mDQnqUSBlccZZTcGPsvgpbLs",
    authDomain: "proyectowebfinal-ee0c5.firebaseapp.com",
    databaseURL: "https://proyectowebfinal-ee0c5-default-rtdb.firebaseio.com",
    projectId: "proyectowebfinal-ee0c5",
    storageBucket: "proyectowebfinal-ee0c5.firebasestorage.app",
    messagingSenderId: "1085156049377",
    appId: "1:1085156049377:web:d437c5151a5cd5dbad12a0"
};


// === Inicializar Firebase ===
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// === Función para cargar los autos ===
function cargarProductosPorMarca() {
    console.log(" Cargando datos desde Firebase...");

    const dbRef = refS(db, "Automoviles");


    onValue(dbRef, (snapshot) => {
        console.log("Datos recibidos:", snapshot.val());

        // Limpia los contenedores
        document.getElementById("contenedorToyota").innerHTML = "";
        document.getElementById("contenedorNissan").innerHTML = "";
        document.getElementById("contenedorFord").innerHTML = "";

        snapshot.forEach((carro) => {
            const data = carro.val();

            // Crear tarjeta
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta";
            tarjeta.innerHTML = `
        <img class="imagen-img" src="${data.urlImg}" alt="${data.modelo}" width="250">
        <h2 class="modelo">${data.modelo}</h2>
        <p class="descripcion">${data.descripcion}</p>
        <button class="boton">Más información</button>`;

            // Insertar en el contenedor correcto
            const marca = data.marca.trim().toLowerCase();
            if (marca === "toyota") {
                document.getElementById("contenedorToyota").appendChild(tarjeta);
            } else if (marca === "nissan") {
                document.getElementById("contenedorNissan").appendChild(tarjeta);
            } else if (marca === "ford") {
                document.getElementById("contenedorFord").appendChild(tarjeta);
            } else {
                console.warn("Marca desconocida:", marca, data);
            }
        });
    }, (error) => {
        console.error("Error al leer la base de datos:", error);
    });
}

// === Ejecutar al cargar la página ===
window.addEventListener("load", cargarProductosPorMarca);