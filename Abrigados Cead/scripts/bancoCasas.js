import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getDatabase,
    ref,
    onChildAdded
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAIaDFQIV0jm4TUqQPI-bn6OE0vD020KaM",
    authDomain: "cead-abrigados-casas.firebaseapp.com",
    databaseURL: "https://cead-abrigados-casas-default-rtdb.firebaseio.com",
    projectId: "cead-abrigados-casas",
    storageBucket: "cead-abrigados-casas.appspot.com",
    messagingSenderId: "576711679063",
    appId: "1:576711679063:web:569a5f605649b0d1e65712",
    measurementId: "G-GFEE37TTR2"
};

// Inicialize o app Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Inicialize o Realtime Database

// Referência à lista de desabrigados
const desabrigadosRef = ref(database, "desabrigados");

// Função para adicionar uma nova linha na tabela
function adicionarLinhaTabela(dados) {
    const tabelaBody = document.getElementById("tabelaDesabrigados").querySelector("tbody");

    // Cria uma nova linha
    const novaLinha = document.createElement("tr");

    // Preenche as células com os dados fornecidos
    novaLinha.innerHTML = `
        <td>${dados.nome || ""}</td>
        <td>${dados.cpfProprietario || ""}</td>
        <td>${dados.quantAdultos || ""}</td>
        <td>${dados.quantCriancas || ""}</td>
        <td>${dados.endereco || ""}</td>
        <td>${dados.cidade || ""}</td>
        <td>${dados.estado || ""}</td>
    `;

    // Adiciona a nova linha ao corpo da tabela
    tabelaBody.appendChild(novaLinha);
}

// Configura o evento `onChildAdded` para adicionar cada novo registro à tabela
onChildAdded(desabrigadosRef, (snapshot) => {
    const dados = snapshot.val();
    adicionarLinhaTabela(dados);
});
