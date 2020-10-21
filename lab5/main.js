const { table } = require('table');
const Create = require('./Create');
const Process = require('./Process');
const Model = require('./Model');

function main() {
    console.log('---task1---');
    task1();
    console.log('---task2---');
    task2();
    console.log('---task3---');
    task3();
    console.log('---task4---');
    task4();
    console.log('---task5---');
    task5();
}

main();

function task1() {
    const c = new Create(2, 'Create');
    const p1 = new Process(0.6, 'Process1', 100, 1);
    const p2 = new Process(0.3, 'Process2', 100, 1);
    const p3 = new Process(0.4, 'Process3', 100, 1);
    const p4 = new Process(0.1, 'Process4', 100, 2);
    const d = new Process(0, 'Despose');

    c.nextElements.push({ element: p1 });

    p1.nextElements.push({ element: d, probability: 0.42, priority: 0 });
    p1.nextElements.push({ element: p2, probability: 0.15, priority: 0 });
    p1.nextElements.push({ element: p3, probability: 0.13, priority: 0 });
    p1.nextElements.push({ element: p4, probability: 0.3, priority: 0 });
    p2.nextElements.push({ element: p1 });
    p3.nextElements.push({ element: p1 });
    p4.nextElements.push({ element: p1 });

    const list = new Array();
    list.push(c, p1, p2, p3, p4);

    const model = new Model(list);
    model.simulate(1000);
}

function task2() {
    const N = 5;

    const delay = Math.random() * 5;

    const c = new Create(delay, 'Create');
    const list = new Array();
    list.push(c);
    for (let i = 1; i < N + 1; i++) {
        const channels = Math.floor(Math.random() * 3 + 1);
        const maxQueue = Math.floor(Math.random() * 5 + 1);
        const p = new Process(delay, 'Process' + i, maxQueue, channels);
        list[i - 1].nextElements.push({ element: p });
        list.push(p);
    }

    const d = new Process(0, 'Despose');

    list[list.length - 1].nextElements.push({ element: d });

    const model = new Model(list);
    model.simulate(1000);
}

function task3() {
    const data = [['N'], ['time']];
    let N = 5;
    const numOfExperiments = 20;
    const delay = Math.random() * 4 + 1;
    const channels = Math.floor(Math.random() * 3 + 1);
    const maxQueue = Math.floor(Math.random() * 5 + 1);
    for (let i = 0; i < numOfExperiments; i++) {
        const c = new Create(delay, 'Create');
        const list = new Array();
        list.push(c);
        for (let j = 1; j < N + 1; j++) {
            const p = new Process(delay, 'Process' + j, maxQueue, channels);
            list[j - 1].nextElements.push({ element: p });
            list.push(p);
        }

        const d = new Process(0, 'Despose');
        list[list.length - 1].nextElements.push({ element: d });

        const model = new Model(list);
        const start = Date.now();
        model.simulate(10000, false);
        const end = Date.now();
        data[0].push(N);
        data[1].push(end - start);

        N += 2;
    }
    console.log(table(data));
}

function task4() {
    const data = [['N', 'experimental', 'theoretical', '%']];
    let N = 5;
    const modelingTime = 10000;
    const numOfExperiments = 20;
    const delay = Math.random() * 4 + 1;
    const channels = Math.floor(Math.random() * 3 + 1);
    const maxQueue = Math.floor(Math.random() * 5 + 1);
    for (let i = 0; i < numOfExperiments; i++) {
        const c = new Create(delay, 'Create');
        const list = new Array();
        list.push(c);
        for (let j = 1; j < N + 1; j++) {
            const p = new Process(delay, 'Process' + j, maxQueue, channels);
            list[j - 1].nextElements.push({ element: p });
            list.push(p);
        }

        const d = new Process(0, 'Despose');
        list[list.length - 1].nextElements.push({ element: d });

        const model = new Model(list);
        const start = Date.now();
        model.simulate(modelingTime, false);
        const end = Date.now();
        data.push([N, end - start, '', '']);
        //console.log(N, end - start);
        N += 2;
    }

    for (let i = 0; i < numOfExperiments; i++) {
        const theoretical = (1 / delay * modelingTime * (N + 1)).toFixed(0);
        data[i + 1][2] = theoretical;
        data[i + 1][3] = (theoretical / data[i + 1][1]).toFixed(2);
        N += 2;
    }

    console.log(table(data));
}

function task5() {
    const data = [['N'], ['time']];
    let N = 5;
    const numOfExperiments = 20;
    const delay = Math.random() * 5;
    const channels = Math.floor(Math.random() * 3 + 1);
    const maxQueue = Math.floor(Math.random() * 5 + 1);
    for (let i = 0; i < numOfExperiments; i++) {
        const c = new Create(delay, 'Create');
        const list = new Array();
        list.push(c);
        for (let j = 1; j < N + 1; j += 2) {
            const p1 = new Process(delay, 'Process' + j, maxQueue, channels);
            const p2 = new Process(delay, 'Process' + j, maxQueue, channels);
            if (j === 1) {
                list[j - 1].nextElements.push({ element: p1, probability: 0.5 });
                list[j - 1].nextElements.push({ element: p2, probability: 0.5 });
            } else {
                list[j - 1].nextElements.push({ element: p1, probability: 0.5 });
                list[j - 1].nextElements.push({ element: p2, probability: 0.5 });
                list[j - 2].nextElements.push({ element: p1, probability: 0.5 });
                list[j - 2].nextElements.push({ element: p2, probability: 0.5 });
            }
            list.push(p1, p2);
        }

        const d = new Process(0, 'Despose');
        list[list.length - 1].nextElements.push({ element: d });
        list[list.length - 2].nextElements.push({ element: d });

        const model = new Model(list);
        const start = Date.now();
        model.simulate(10000, false);
        const end = Date.now();
        data[0].push(N);
        data[1].push(end - start);
        // if (i > 1) {
        //     console.log(N, end - start);
        // }
        N += 2;
    }

    console.log(table(data));
}
