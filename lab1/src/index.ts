import { app, BrowserWindow, ipcMain } from "electron";
import * as statistics from 'simple-statistics';
import * as path from "path";

import * as generators from './generators';

let mainWindow: BrowserWindow;
const numOfIntervals = 20;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        },
        width: 1000,
    });

    mainWindow.loadFile(path.join(__dirname, "../index.html"));
    //mainWindow.webContents.openDevTools();
    //mainWindow.menuBarVisible = false;
}

app.on("ready", () => {
    createWindow();

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    ipcMain.on('generate:exp', async (_event, number: number, lambda) => {
        lambda = parseInt(lambda);
        const numbers = generators.exp(number, lambda);
        const { intervals, intervalsBound } = generators.calcIntevrals(numbers, numOfIntervals);
        const mean = statistics.mean(numbers);
        const theoreticalIntervals = generators.calcTheoreticalIntervalsExp(number, intervalsBound, 1/mean);
        const chi = generators.calcChiSquare(intervals, theoreticalIntervals);
        const chiTheoretical = generators.chiTheoretical[intervals.length - 1];
        const variance = statistics.variance(numbers);
        mainWindow.webContents.send('results:exp', intervals, intervalsBound, chi, chiTheoretical, mean, variance);
    });

    ipcMain.on('generate:normal', async (_event, number: number, alpha, sigma) => {
        alpha = parseInt(alpha);
        sigma = parseInt(sigma);
        const numbers = generators.normal(number, alpha, sigma);
        const { intervals, intervalsBound } = generators.calcIntevrals(numbers, numOfIntervals);
        const mean = statistics.mean(numbers);
        const variance = statistics.variance(numbers);
        const theoreticalIntervals = generators.calcTheoreticalIntervalsNormal(number, intervalsBound, mean, Math.sqrt(variance));
        const chi = generators.calcChiSquare(intervals, theoreticalIntervals);
        const chiTheoretical = generators.chiTheoretical[intervals.length - 2];
        mainWindow.webContents.send('results:normal', intervals, intervalsBound, chi, chiTheoretical, mean, variance);
    });

    ipcMain.on('generate:uniform', async (_event, number: number, a, c) => {
        a = parseInt(a);
        c = parseInt(c);
        const numbers = generators.uniform(number, a, c);
        const { intervals, intervalsBound } = generators.calcIntevrals(numbers, numOfIntervals);
        const theoreticalIntervals = generators.calcTheoreticalIntervalsUniform(number, intervalsBound, 0, 1);
        const chi = generators.calcChiSquare(intervals, theoreticalIntervals);
        const chiTheoretical = generators.chiTheoretical[intervals.length - 2];
        const mean = statistics.mean(numbers);
        const variance = statistics.variance(numbers);
        mainWindow.webContents.send('results:uniform', intervals, intervalsBound, chi, chiTheoretical, mean, variance);
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});