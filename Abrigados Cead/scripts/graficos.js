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

// Variáveis para contar as faixas etárias
let criancasAte2 = 0;
let criancasDe3a5 = 0;
let criancasDe6a9 = 0;
let criancasDe10a15 = 0;

// Referência à lista de desabrigados
const desabrigadosRef = ref(database, "desabrigados");

// Inicializa a estrutura do gráfico para pizza
let graficoPizza;

// Função para atualizar o gráfico de pizza com novos dados
function atualizarGrafico() {
    const contexto = document.getElementById("graficoIdades").getContext("2d");

    // Se o gráfico já foi criado, apenas atualize os dados
    if (graficoPizza) {
        graficoPizza.data.datasets[0].data = [
            criancasAte2,
            criancasDe3a5,
            criancasDe6a9,
            criancasDe10a15
        ];
        graficoPizza.update(); // Atualiza os dados no gráfico
    } else {
        // Cria o gráfico de pizza pela primeira vez
        graficoPizza = new Chart(contexto, {
            type: "pie", // Tipo de gráfico de pizza
            data: {
                labels: [
                    "Crianças até 2 anos",
                    "Crianças entre 3 a 5 anos",
                    "Crianças entre 6 a 9 anos",
                    "Crianças entre 10 a 15 anos"
                ],
                datasets: [
                    {
                        label: "Quantidade de Crianças",
                        data: [
                            criancasAte2,
                            criancasDe3a5,
                            criancasDe6a9,
                            criancasDe10a15
                        ],
                        backgroundColor: [
                            "#FF6384", // Vermelho
                            "#36A2EB", // Azul
                            "#FFCE56", // Amarelo
                            "#4BC0C0" // Verde
                        ]
                    }
                ]
            },
            options: {
                responsive: true
            }
        });
    }
}

// Processar cada criança ao ser adicionada
onChildAdded(desabrigadosRef, (snapshot) => {
    const dados = snapshot.val();
    const idade = parseInt(dados.idade);

    // Classificar os dados em suas respectivas faixas etárias
    if (idade <= 2) {
        criancasAte2++;
    } else if (idade >= 3 && idade <= 5) {
        criancasDe3a5++;
    } else if (idade >= 6 && idade <= 9) {
        criancasDe6a9++;
    } else if (idade >= 10 && idade <= 15) {
        criancasDe10a15++;
    }

    // Atualizar o gráfico com os novos valores
    atualizarGrafico();
});
