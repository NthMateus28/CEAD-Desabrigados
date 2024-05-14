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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let criancasAte2 = 0;
let criancasDe3a5 = 0;
let criancasDe6a9 = 0;
let criancasDe10a15 = 0;
let jovensDe16a30 = 0;
let adultosDe31a50 = 0;
let adultosDe51a60 = 0;
let idosos60mais = 0;

let masculino = 0;
let feminino = 0;

let contagemCidades = {};

const desabrigadosRef = ref(database, "desabrigados");
let graficoPizza;

function atualizarGrafico() {
    const contexto = document.getElementById("graficoIdades").getContext("2d");

    if (graficoPizza) {
        graficoPizza.data.datasets[0].data = [
            criancasAte2,
            criancasDe3a5,
            criancasDe6a9,
            criancasDe10a15,
            jovensDe16a30,
            adultosDe31a50,
            adultosDe51a60,
            idosos60mais
        ];
        graficoPizza.update();
    } else {
        graficoPizza = new Chart(contexto, {
            type: "pie",
            data: {
                labels: [
                    "Crianças até 2 anos",
                    "Crianças de 3 a 5 anos",
                    "Crianças de 6 a 9 anos",
                    "Crianças de 10 a 15 anos",
                    "Jovens de 16 a 30 anos",
                    "Adultos de 31 a 50 anos",
                    "Adultos de 51 a 60 anos",
                    "Idosos de 60+ anos"
                ],
                datasets: [{
                    label: "Quantidade por Faixa Etária",
                    data: [
                        criancasAte2,
                        criancasDe3a5,
                        criancasDe6a9,
                        criancasDe10a15,
                        jovensDe16a30,
                        adultosDe31a50,
                        adultosDe51a60,
                        idosos60mais
                    ],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#C9CB7A",
                        "#A284BE",
                        "#F4D03F",
                        "#E74C3C"
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    datalabels: {
                        color: '#000',
                        anchor: 'end',
                        align: 'start',
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += data;
                            });
                            let percentage = (value*100 / sum).toFixed(2)+"%";
                            return value + ' (' + percentage + ')';
                        }
                    }
                }
            }
            
        });
    }
}

let graficoGenero;

function atualizarGraficoGenero() {
    const contextoGenero = document.getElementById("graficoGenero").getContext("2d");

    if (graficoGenero) {
        graficoGenero.data.datasets[0].data = [masculino, feminino];
        graficoGenero.update();
    } else {
        graficoGenero = new Chart(contextoGenero, {
            type: "pie",
            data: {
                labels: ["Masculino", "Feminino"],
                datasets: [{
                    label: "Distribuição por Gênero",
                    data: [masculino, feminino],
                    backgroundColor: ["#36A2EB", "#FF6384"]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    datalabels: {
                        color: '#fff',
                        display: true,
                        formatter: (value, ctx) => {
                            let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            let percentage = (value / sum * 100).toFixed(2) + '%';
                            return value + ' (' + percentage + ')';
                        }
                    }
                }
            }
        });
    }
}

let graficoCidades;

function atualizarGraficoCidades() {
    const contextoCidades = document.getElementById("graficoCidades").getContext("2d");

    if (graficoCidades) {
        graficoCidades.data.labels = Object.keys(contagemCidades);
        graficoCidades.data.datasets[0].data = Object.values(contagemCidades);
        graficoCidades.update();
    } else {
        graficoCidades = new Chart(contextoCidades, {
            type: "bar",
            data: {
                labels: Object.keys(contagemCidades),
                datasets: [{
                    label: "Quantidade por Cidade",
                    data: Object.values(contagemCidades),
                    backgroundColor: Array(Object.keys(contagemCidades).length).fill("#4BC0C0")
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    datalabels: {
                        color: '#000',
                        display: true,
                        formatter: (value, ctx) => {
                            let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            let percentage = (value / sum * 100).toFixed(2) + '%';
                            return value + ' (' + percentage + ')';
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}


onChildAdded(desabrigadosRef, (snapshot) => {
    const dados = snapshot.val();
    const idade = parseInt(dados.idade);
    const sexo = dados.sexo;
    const cidade = dados.cidade;

    if (sexo === "masculino") {
        masculino++;
    } else if (sexo === "feminino") {
        feminino++;
    }

    if (idade <= 2) {
        criancasAte2++;
    } else if (idade >= 3 && idade <= 5) {
        criancasDe3a5++;
    } else if (idade >= 6 && idade <= 9) {
        criancasDe6a9++;
    } else if (idade >= 10 && idade <= 15) {
        criancasDe10a15++;
    } else if (idade >= 16 && idade <= 30) {
        jovensDe16a30++;
    } else if (idade >= 31 && idade <= 50) {
        adultosDe31a50++;
    } else if (idade >= 51 && idade <= 60) {
        adultosDe51a60++;
    } else if (idade > 60) {
        idosos60mais++;
    }

    if (cidade) {
        if (contagemCidades[cidade]) {
            contagemCidades[cidade]++;
        } else {
            contagemCidades[cidade] = 1; // Inicializa se ainda não estiver no objeto
        }
    }

    // Atualizar os outros gráficos conforme necessário
    atualizarGrafico();
    atualizarGraficoGenero();
    atualizarGraficoCidades(); // Função para atualizar o gráfico das cidades
});

Chart.register(ChartDataLabels);
