const Create = require('./Create');
const Process = require('./Process');
const Model = require('./Model');

function main() {
    const c = new Create(0.5, 'Create');
    const p1 = new Process(0.3, 'Process1', 3, 1);
    const p2 = new Process(0.3, 'Process2', 3, 1);
    const d = new Process(0, 'Despose');

    p1.nextElements.push({ element: d });
    p2.nextElements.push({ element: d });

    c.nextElements.push({ element: p1, priority: 2 });
    c.nextElements.push({ element: p2, priority: 1 });

    const list = new Array();
    list.push(c, p1, p2);

    const model = new Model(list);
    model.simulate(1000);
}

main();
