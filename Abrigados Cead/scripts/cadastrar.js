// Função para aplicar máscara de telefone
function aplicarMascaraTelefone(campo) {
    let telefone = campo.value;

    // Remove caracteres que não são números
    telefone = telefone.replace(/\D/g, "");

    // Limita a quantidade de dígitos ao máximo permitido para telefones no Brasil
    telefone = telefone.substring(0, 11); // Garante no máximo 11 dígitos

    // Aplica a máscara (00) 00000-0000 para 11 dígitos ou (00) 0000-0000 para 10 dígitos
    if (telefone.length > 10) {
        telefone = telefone.replace(/^(\d{2})(\d{1,5})(\d{4})/, "($1) $2-$3");
    } else {
        telefone = telefone.replace(/^(\d{2})(\d{1,4})(\d{4})/, "($1) $2-$3");
    }

    // Atualiza o valor do campo com a máscara
    campo.value = telefone;
}

// Associar a função ao evento `input` do campo telefone
document.getElementById("telefone").addEventListener("input", function() {
    aplicarMascaraTelefone(this);
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    update,
    query,
    orderByChild,
    equalTo,
    get
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

// Variável global para armazenar a chave do desabrigado encontrado
let chaveDesabrigadoEncontrado = "";

// Função para cadastrar desabrigados
function cadastrarDesabrigado(event) {
    event.preventDefault(); // Evitar o recarregamento da página

    // Obter dados do formulário
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const idade = document.getElementById("idade").value;
    const cidade = document.getElementById("cidade").value;
    const abrigo = document.getElementById("abrigo").value;
    const bairro = document.getElementById("bairro").value;
    const sexo = document.getElementById("sexo").value;
    const estado = document.getElementById("estado").value; // Novo campo de entrada/saída

    // Criar uma chave única para o novo desabrigado
    const novoDesabrigadoRef = ref(database, 'desabrigados/' + Date.now());

    // Configuração dos dados a serem enviados
    const dadosDesabrigado = {
        nome,
        telefone,
        idade,
        cidade,
        abrigo,
        bairro,
        sexo,
        estado
    };

    // Enviar dados para o Realtime Database
    set(novoDesabrigadoRef, dadosDesabrigado)
    .then(() => {
        alert('Cadastro realizado com sucesso!');
        document.getElementById("cadastroForm").reset(); // Limpar o formulário após o cadastro
    })
    .catch((error) => {
        alert('Erro ao cadastrar: ' + error.message);
    });
}

// Função para buscar desabrigado pelo nome
function buscarDesabrigado() {
    const nomeBuscado = document.getElementById("nome").value; // Nome inserido no campo de busca

    // Referência à coleção "desabrigados" ordenada pelo campo "nome"
    const desabrigadosRef = query(ref(database, "desabrigados"), orderByChild("nome"), equalTo(nomeBuscado));

    // Obter os dados do banco
    get(desabrigadosRef).then((snapshot) => {
        if (snapshot.exists()) {
            // Iterar sobre os resultados (assumindo que pode haver múltiplos resultados)
            snapshot.forEach((childSnapshot) => {
                const dados = childSnapshot.val();
                chaveDesabrigadoEncontrado = childSnapshot.key; // Armazena a chave para alterações futuras

                // Preencher os campos do formulário
                document.getElementById("telefone").value = dados.telefone || "";
                document.getElementById("idade").value = dados.idade || "";
                document.getElementById("cidade").value = dados.cidade || "";
                document.getElementById("abrigo").value = dados.abrigo || "";
                document.getElementById("bairro").value = dados.bairro || "";
                document.getElementById("sexo").value = dados.sexo || "";
                document.getElementById("estado").value = dados.estado || ""; // Preenche o novo campo de entrada/saída
            });
        } else {
            alert("Desabrigado não encontrado.");
            chaveDesabrigadoEncontrado = ""; // Limpa a variável para não armazenar chaves incorretas
        }
    }).catch((error) => {
        alert("Erro ao buscar: " + error.message);
    });
}

// Função para alterar os dados de um desabrigado existente
function alterarDesabrigado() {
    if (chaveDesabrigadoEncontrado === "") {
        alert("Por favor, busque um desabrigado antes de tentar alterá-lo.");
        return;
    }

    // Obter os dados atualizados do formulário
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const idade = document.getElementById("idade").value;
    const cidade = document.getElementById("cidade").value;
    const abrigo = document.getElementById("abrigo").value;
    const bairro = document.getElementById("bairro").value;
    const sexo = document.getElementById("sexo").value;
    const estado = document.getElementById("estado").value; // Novo campo de entrada/saída

    // Dados atualizados
    const dadosAtualizados = {
        nome,
        telefone,
        idade,
        cidade,
        abrigo,
        bairro,
        sexo,
        estado
    };

    // Atualizar o registro existente usando a chave armazenada
    update(ref(database, 'desabrigados/' + chaveDesabrigadoEncontrado), dadosAtualizados)
    .then(() => {
        alert("Dados atualizados com sucesso!");
    })
    .catch((error) => {
        alert("Erro ao atualizar os dados: " + error.message);
    });
}

// Associar a função `cadastrarDesabrigado` ao evento de envio do formulário
document.getElementById("cadastroForm").addEventListener("submit", cadastrarDesabrigado);

// Tornar as funções acessíveis no escopo global
window.buscarDesabrigado = buscarDesabrigado;
window.alterarDesabrigado = alterarDesabrigado;
