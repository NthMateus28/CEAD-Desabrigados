import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getDatabase,
    ref,
    onChildAdded
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDcyHzENAIVz98VdGHYerBFfmc3eSnWPqs",
    authDomain: "cead-abrigados.firebaseapp.com",
    databaseURL: "https://cead-abrigados-default-rtdb.firebaseio.com",
    projectId: "cead-abrigados",
    storageBucket: "cead-abrigados.appspot.com",
    messagingSenderId: "408381562641",
    appId: "1:408381562641:web:9495f8206d0eda67d6b6b0",
    measurementId: "G-KCL3K8YF3B"
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
        <td>${dados.idade || ""}</td>
        <td>${dados.cidade || ""}</td>
        <td>${dados.abrigo || ""}</td>
        <td>${dados.bairro || ""}</td>
        <td>${dados.sexo || ""}</td>
    `;

    // Adiciona a nova linha ao corpo da tabela
    tabelaBody.appendChild(novaLinha);
}

// Configura o evento `onChildAdded` para adicionar cada novo registro à tabela
onChildAdded(desabrigadosRef, (snapshot) => {
    const dados = snapshot.val();
    adicionarLinhaTabela(dados);
});
