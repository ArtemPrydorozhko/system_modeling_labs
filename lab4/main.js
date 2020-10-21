const Create = require('./Create');
const Process = require('./Process');
const Model = require('./Model');

function main() {
    const parameters = [
        // [2.0, 1.0, 2.0, 2.0, 2.0, 5.0, 5.0, 5.0, 5.0],
        [1.0, 1.0, 2.0, 2.0, 2.0, 5.0, 5.0, 5.0, 5.0],
        // [2.0, 2.0, 2.0, 2.0, 2.0, 5.0, 5.0, 5.0, 5.0],
        // [2.0, 1.0, 2.0, 2.0, 3.0, 5.0, 5.0, 5.0, 5.0],
        // [2.0, 1.0, 2.0, 2.0, 2.0, 10.0, 5.0, 5.0, 5.0],
        // [2.0, 1.0, 2.0, 2.0, 2.0, 8.0, 8.0, 8.0, 8.0],
    ];

    for (let i = 0; i < parameters.length; i++) {
        const c = new Create(parameters[i][0], 'Create');
        const p1 = new Process(parameters[i][1], 'Process1', parameters[i][5], 3);
        const p2 = new Process(parameters[i][2], 'Process2', parameters[i][6], 3);
        const p3 = new Process(parameters[i][3], 'Process3', parameters[i][7], 3);
        const p4 = new Process(parameters[i][4], 'Process4', parameters[i][8], 3);
        const d = new Process(0, 'Despose');

        p1.nextElements.push({ element: p2, probability: 0.5, priority: 0 });
        p1.nextElements.push({ element: p3, probability: 0.5, priority: 0 });
        p2.nextElements.push({ element: d });
        p3.nextElements.push({ element: p4 });
        p4.nextElements.push({ element: p1, probability: 0.3, priority: 0 });
        p4.nextElements.push({ element: d, probability: 0.7, priority: 0 });

        c.nextElements.push(p1);

        const list = new Array();
        list.push(c, p1, p2, p3, p4);

        const model = new Model(list);
        model.simulate(1000);
    }
}

main();
