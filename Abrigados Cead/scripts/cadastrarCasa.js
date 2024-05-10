// Função para formatar o campo CPF
function formatarCPF(campo) {
    let cpf = campo.value;

    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, "");

    // Formata com os pontos e traço do CPF
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    // Atualiza o valor do campo com a formatação
    campo.value = cpf;
}

// Associar a função ao evento `input` do campo CPF
const campoCPF = document.getElementById("cpfProprietario");
campoCPF.addEventListener("input", () => formatarCPF(campoCPF));


// Função para preencher as cidades a partir da API do IBGE
function carregarCidadesRS() {
    const selectCidade = document.getElementById("cidade");
    
    // Verificar se o elemento <select> está acessível
    if (!selectCidade) {
        console.error("Elemento <select> com id 'cidade' não encontrado.");
        return;
    }

    console.log("Campo de seleção encontrado:", selectCidade);

    // URL para buscar as cidades do Rio Grande do Sul
    const url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/RS/municipios";

    // Fazer a requisição para a API do IBGE
    fetch(url)
        .then(response => {
            // Verificar se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error("Erro na requisição: " + response.statusText);
            }
            return response.json();
        })
        .then(cidades => {
            console.log(`Total de cidades encontradas: ${cidades.length}`);
            cidades.forEach(cidade => {
                console.log(`Adicionando cidade: ${cidade.nome}`);
                const option = document.createElement("option");
                option.value = cidade.nome;
                option.textContent = cidade.nome;
                selectCidade.appendChild(option); // Adiciona a cidade ao campo <select>
            });

            console.log("Preenchimento das cidades concluído.");
            console.log(`Conteúdo final do select: ${selectCidade.innerHTML}`);
        })
        .catch(error => {
            console.error("Erro ao carregar as cidades:", error);
        });
}

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarCidadesRS);

// Inicializar o Firebase e banco de dados
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

// Variável global para armazenar a chave do desabrigado encontrado
let chaveDesabrigadoEncontrado = "";

// Função para cadastrar desabrigados
function cadastrarDesabrigado(event) {
    event.preventDefault(); // Evitar o recarregamento da página

    // Obter dados do formulário
    const nome = document.getElementById("nome").value;
    const cpfProprietario = document.getElementById("cpfProprietario").value;
    const quantAdultos = document.getElementById("quantAdultos").value;
    const quantCriancas = document.getElementById("quantCriancas").value;
    const endereco = document.getElementById("endereco").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;

    // Criar uma chave única para o novo desabrigado
    const novoDesabrigadoRef = ref(database, 'desabrigados/' + Date.now());

    // Configuração dos dados a serem enviados
    const dadosDesabrigado = {
        nome,
        cpfProprietario,
        quantAdultos,
        quantCriancas,
        endereco,
        cidade,
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
                document.getElementById("cpfProprietario").value = dados.cpfProprietario || "";
                document.getElementById("quantAdultos").value = dados.quantAdultos || "";
                document.getElementById("quantCriancas").value = dados.quantCriancas || "";
                document.getElementById("endereco").value = dados.endereco || "";
                document.getElementById("cidade").value = dados.cidade || "";
                document.getElementById("estado").value = dados.estado || "";
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
    const cpfProprietario = document.getElementById("cpfProprietario").value;
    const quantAdultos = document.getElementById("quantAdultos").value;
    const quantCriancas = document.getElementById("quantCriancas").value;
    const endereco = document.getElementById("endereco").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;

    // Dados atualizados
    const dadosAtualizados = {
        nome,
        cpfProprietario,
        quantAdultos,
        quantCriancas,
        endereco,
        cidade,
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

// Adicionar evento `input` para aplicar máscara de CPF ao campo correspondente
document.getElementById("cpfProprietario").addEventListener("input", function () {
    aplicarMascaraCPF(this);
});

// Tornar as funções acessíveis no escopo global
window.buscarDesabrigado = buscarDesabrigado;
window.alterarDesabrigado = alterarDesabrigado;
