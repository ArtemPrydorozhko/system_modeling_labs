const Create = require('./Create');
const Process = require('./Process');
const Doctor = require('./Doctor');
const Laboratory = require('./Laboratory');
const Model = require('./Model');
const Patient = require('./Patient');

function main() {
    const max = Number.MAX_SAFE_INTEGER;
    const c = new Create(15, null, 'Create', 'exp', [
        new Patient(1, 0.5, 15),
        new Patient(2, 0.1, 40),
        new Patient(3, 0.4, 30)
    ]);
    const p1 = new Doctor(0, 0, 'Doctors', 'exp', max, 2);
    const p2 = new Process(3, 8, 'Assistant', 'uniform', max, 3);
    const p3 = new Process(2, 5, 'Transition1', 'uniform', max, 1);
    const p4 = new Process(2, 5, 'Transition2', 'uniform', max, 1);
    const p5 = new Process(4.5, 3, 'RegistrationLab', 'erlang', max, 1);
    const p6 = new Laboratory(4, 2, 'Lab', 'erlang', max, 2);
    const d = new Process(0,0, 'Despose', '');

    c.nextElements.push(p1);
    p1.nextElements.push({ element: p2 });
    p1.nextElements.push({ element: p3 });

    p2.nextElements.push({ element: d });

    p3.nextElements.push({ element: p5 });

    p5.nextElements.push({ element: p6 });

    p4.nextElements.push({ element: p1 })

    p6.nextElements.push({ element: p4 });
    p6.nextElements.push({ element: d });

    const list = new Array();
    list.push(c, p1, p2, p3, p4, p5, p6);

    const model = new Model(list);
    model.simulate(1000);
}

main();
