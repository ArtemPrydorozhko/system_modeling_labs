const { NormalDistribution } = require('./NormalDistribution');

const chiTheoretical = [3.8, 6, 7.8, 9.5, 11.1, 12.6, 14.1, 15.5, 16.9, 18.3,
                        19.7, 21, 22.4, 23.7, 25, 26.3, 27.6, 28.9, 30.1, 31.4,
                        32.7, 33.9, 35.2, 36.4, 37.7, 38.9, 40.1, 41.3, 42.6, 43.8];

function exp(numbers: number, lambda: number): number[] {
    if (numbers < 0) {
        return [];
    }
    const generatedNumbers = new Array<number>(numbers);
    for (let i = 0; i < numbers; i++) {
        const e = Math.random();
        generatedNumbers[i] = -1 / lambda * Math.log(e);
    }

    return generatedNumbers;
}

function normal(numbers: number, alpha: number, sigma: number): number[] {
    if (numbers < 0) {
        return [];
    }
    const generatedNumbers = new Array<number>(numbers);
    for (let i = 0; i < numbers; i++) {
        let e = 0;
        for (let j = 0; j < 12; j++) {
            e += Math.random();
        }
        const m = e - 6;

        generatedNumbers[i] = sigma * m + alpha;
    }

    return generatedNumbers;
}

function uniform(numbers: number, a: number, c: number): number[] {
    if (numbers < 0) {
        return [];
    }
    const generatedNumbers = new Array<number>(numbers);
    const helperNumbers = new Array<number>(numbers);
    generatedNumbers[0] = Math.random();
    helperNumbers[0] = generatedNumbers[0] * c;
    for (let i = 1; i < numbers; i++) {
        const z = a * helperNumbers[i - 1] % c;
        helperNumbers[i] = z;
        generatedNumbers[i] = z / c;
    }

    return generatedNumbers;
}

function calcIntevrals(numbers: number[], intervalsAmount: number): { intervals: number[], intervalsBound: number[] } {
    let intervals = new Array<number>(intervalsAmount);
    intervals.fill(0);

    const sortedNumbers = [...numbers];
    sortedNumbers.sort((a, b) => a - b);

    const max = parseFloat(sortedNumbers[sortedNumbers.length - 1].toString());
    const min = parseFloat(sortedNumbers[0].toString());

    const step = Math.abs(max - min) / intervalsAmount;

    const intervalsBound = new Array<number>();
    intervalsBound.fill(0);
    intervalsBound[0] = min;
    //const steps = new Array();

    let current = min + step;
    let interval = 0
    for (let i = 0; i < sortedNumbers.length; i++) {
        if (sortedNumbers[i] < current) {
            intervals[interval]++;
        } else {
            if (intervals[interval] >= 5){
                intervalsBound[interval + 1] = current;
                // steps.push(current);
                interval++;
            } else {
                intervals.pop();
            }
            current += step;
        }
    }
    intervalsBound[interval + 1] = current

    intervals = intervals.filter(el => el !== 0);

    // current = min;

    // for (let i = 1; i < intervals.length; i++) {
    //     intervalsBound[i] = steps[i];
    //     current += step;
    // }

    return {
        intervals,
        intervalsBound,
    };
}

function calcTheoreticalIntervalsExp(numbers: number, intervalsBound: number[], lambda: number): number[] {
    const theoreticalIntervals = new Array<number>(intervalsBound.length - 1);
    for (let i = 0; i < intervalsBound.length - 1; i++) {
        theoreticalIntervals[i] = numbers * (expDistribution(intervalsBound[i + 1], lambda) - expDistribution(intervalsBound[i], lambda));
    }
    return theoreticalIntervals;
}

function calcTheoreticalIntervalsNormal(numbers: number, intervalsBound: number[], alpha: number, sigma: number): number[] {
    const normalDist = new NormalDistribution(alpha, sigma);

    const theoreticalIntervals = new Array<number>(intervalsBound.length - 1);
    for (let i = 0; i < intervalsBound.length - 1; i++) {
        theoreticalIntervals[i] = numbers * normalDist.probabilityBetween(intervalsBound[i + 1], intervalsBound[i]);
    }
    return theoreticalIntervals;
}

function calcTheoreticalIntervalsUniform(numbers: number, intervalsBound: number[], a: number, c: number): number[] {
    const theoreticalIntervals = new Array<number>(intervalsBound.length - 1);
    for (let i = 0; i < intervalsBound.length - 1; i++) {    
        theoreticalIntervals[i] = numbers * (uniformDistribution(intervalsBound[i + 1], 0, 1) - uniformDistribution(intervalsBound[i], 0, 1));
    }
    return theoreticalIntervals;
}

function calcChiSquare(intervals: number[], theoreticalIntervals: number[]) {
    let chi = 0;

    for (let i = 0; i < intervals.length; i++) {
        if (theoreticalIntervals[i] === 0) {
            continue;
        }
        chi += Math.pow(intervals[i] - theoreticalIntervals[i], 2) / theoreticalIntervals[i];
    }
    return chi;
}

function expDistribution(x: number, labmda: number) {
    if (x < 0) {
        return 0;
    }
    return 1 - Math.pow(Math.E, -labmda * x);
}

function normalDistribution(x: number, alpha: number, sigma: number) {
    return 1 / (sigma * Math.sqrt(2 * Math.PI)) *
        Math.pow(Math.E, -1 * (x - alpha) * (x - alpha) / (2 * sigma * sigma));
}

function uniformDistribution(x: number, a: number, b: number) {
    if (x < a) {
        return 0;
    }
    if (x > b) {
        return 1;
    }
    return (x - a) / (b - a);
}

export {
    exp,
    normal,
    uniform,
    calcIntevrals,
    calcTheoreticalIntervalsExp,
    calcTheoreticalIntervalsNormal,
    calcTheoreticalIntervalsUniform,
    calcChiSquare,
    chiTheoretical,
};