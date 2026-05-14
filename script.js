// 1. Importaciones únicas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Tu configuración REAL (extraída de tu archivo)
const firebaseConfig = {
  apiKey: "AIzaSyDvuPM8MP0-57xj19n0owEj6Q6OxeMB-8Y",
  authDomain: "proyecto-certus-82b28.firebaseapp.com",
  projectId: "proyecto-certus-82b28",
  storageBucket: "proyecto-certus-82b28.firebasestorage.app",
  messagingSenderId: "386201360338",
  appId: "1:386201360338:web:10edb232bd55175b4eda0b",
  measurementId: "G-7G6T14WZNY",
};

// 3. Inicializar una sola vez
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- LÓGICA PARA PAÍSES ---
const paisesRef = collection(db, "paises");
const inputPais = document.getElementById("paisInput");
const botonPais = document.getElementById("btnAgregar");
const listaUl = document.getElementById("listaPaises");

if (botonPais) {
  botonPais.addEventListener("click", async () => {
    const nombrePais = inputPais.value.trim();
    if (nombrePais !== "") {
      try {
        await addDoc(paisesRef, { nombre: nombrePais, fecha: Date.now() });
        inputPais.value = "";
      } catch (e) {
        console.error("Error en países:", e);
      }
    }
  });

  const q = query(paisesRef, orderBy("fecha", "desc"));
  onSnapshot(q, (snapshot) => {
    if (listaUl) {
      listaUl.innerHTML = "";
      snapshot.forEach((doc) => {
        const li = document.createElement("li");
        li.textContent = doc.data().nombre;
        listaUl.appendChild(li);
      });
    }
  });
}

// --- LÓGICA PARA EL CARRITO (Accesorios) ---
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-carrito")) {
    // Es vital que el HTML tenga estos atributos data-
    const nombre = e.target.getAttribute("data-nombre");
    const precio = e.target.getAttribute("data-precio");

    if (nombre && precio) {
      try {
        await addDoc(collection(db, "carrito"), {
          producto: nombre,
          precio: parseFloat(precio),
          fecha: new Date().toLocaleString(),
        });
        alert(`✅ ${nombre} guardado en Firebase`);
      } catch (error) {
        console.error("Error en el carrito:", error);
      }
    } else {
      console.error("Faltan atributos data-nombre o data-precio en el botón");
    }
  }
});
