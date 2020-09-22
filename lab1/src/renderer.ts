const { ipcRenderer } = require('electron');
const Chart = require('chart.js');

const generateExp = document.getElementById('chart-generate-exp')!;
const generateNormal = document.getElementById('chart-generate-normal')!;
const generateUniform = document.getElementById('chart-generate-uniform')!;

const chiExp = document.getElementById('chi-exp')!;
const chiNormal = document.getElementById('chi-normal')!;
const chiUniform = document.getElementById('chi-uniform')!;

const chiTheorExp = document.getElementById('chi-theor-exp')!;
const chiTheorNormal = document.getElementById('chi-theor-normal')!;
const chiTheorUniform = document.getElementById('chi-theor-uniform')!;

const meanExp = document.getElementById('mean-exp')!;
const meanNormal = document.getElementById('mean-normal')!;
const meanUniform = document.getElementById('mean-uniform')!;

const varianceExp = document.getElementById('variance-exp')!;
const varianceNormal = document.getElementById('variance-normal')!;
const varianceUniform = document.getElementById('variance-uniform')!;

const expChartCanvas = (<HTMLCanvasElement>document.getElementById('chart-exp'))!.getContext('2d');
const normalChartCanvas = (<HTMLCanvasElement>document.getElementById('chart-normal'))!.getContext('2d');
const uniformChartCanvas = (<HTMLCanvasElement>document.getElementById('chart-uniform'))!.getContext('2d');

generateExp.addEventListener('click', (_event) => {
    const numbers = (<HTMLInputElement>document.getElementById('chart-exp-number')).value;
    const lambda = (<HTMLInputElement>document.getElementById('chart-exp-lambda')).value;
    ipcRenderer.send('generate:exp', numbers, lambda);
});

generateNormal.addEventListener('click', (_event) => {
    const numbers = (<HTMLInputElement>document.getElementById('chart-normal-number')).value;
    const alpha = (<HTMLInputElement>document.getElementById('chart-normal-alpha')).value;
    const sigma = (<HTMLInputElement>document.getElementById('chart-normal-sigma')).value;
    ipcRenderer.send('generate:normal', numbers, alpha, sigma);
});

generateUniform.addEventListener('click', (_event) => {
    const numbers = (<HTMLInputElement>document.getElementById('chart-uniform-number')).value;
    const a = (<HTMLInputElement>document.getElementById('chart-uniform-a')).value;
    const c = (<HTMLInputElement>document.getElementById('chart-uniform-c')).value;
    ipcRenderer.send('generate:uniform', numbers, a, c);
});

const options = {
    aspectRatio: 2,
    scales: {
        xAxes: [{
            gridLines: {
                offsetGridLines: true
            }
        }],
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
}

const expChart = new Chart(expChartCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Exponential',
            data: [],
            backgroundColor: 'green',
        }]
    },
    options: {
        ...options
    }
});

const normalChart = new Chart(normalChartCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Normal',
            data: [],
            backgroundColor: 'green',
        }]
    },
    options: {
        ...options
    }
});

const uniformChart = new Chart(uniformChartCanvas, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Uniform',
            data: [],
            backgroundColor: 'green',
        }]
    },
    options: {
        ...options
    }
});

ipcRenderer.on('results:exp', (_event, results: number[], intervalsBound: number[], chi, chiTheoretical, mean, variance) => {
    expChart.data.labels = intervalsBound.map(el => el.toFixed(2));
    expChart.data.datasets[0].data = results;
    expChart.update();
    chiExp.innerText = `Chi square: ${chi}`;
    chiTheorExp.innerText = `Chi theoretical: ${chiTheoretical}`;
    meanExp.innerText = `Mean: ${mean}`;
    varianceExp.innerText = `Variance: ${variance}`;
});

ipcRenderer.on('results:normal', (_event, results: number[], intervalsBound: number[], chi, chiTheoretical, mean, variance) => {
    normalChart.data.labels = intervalsBound.map(el => el.toFixed(2));
    normalChart.data.datasets[0].data = results;
    normalChart.update();
    chiNormal.innerText = `Chi square: ${chi}`;
    chiTheorNormal.innerText = `Chi theoretical: ${chiTheoretical}`;
    meanNormal.innerText = `Mean: ${mean}`;
    varianceNormal.innerText = `Variance: ${variance}`;
});

ipcRenderer.on('results:uniform', (_event, results: number[], intervalsBound: number[], chi, chiTheoretical, mean, variance) => {
    uniformChart.data.labels = intervalsBound.map(el => el.toFixed(2));
    uniformChart.data.datasets[0].data = results;
    uniformChart.update();
    chiUniform.innerText = `Chi square: ${chi}`;
    chiTheorUniform.innerText = `Chi theoretical: ${chiTheoretical}`;
    meanUniform.innerText = `Mean: ${mean}`;
    varianceUniform.innerText = `Variance: ${variance}`;
});
