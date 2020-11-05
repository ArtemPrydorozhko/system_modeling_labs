const Arc = require('./Arc');
const Position = require('./Position');
const Transition = require('./Transition');
const Model = require('./Model');

function main() {
    const p1 = new Position('position1', 1);
    const p2 = new Position('position2', 0);
    const p3 = new Position('position3', 0);
    const p4 = new Position('position4', 0);
    const p5 = new Position('position5', 0);
    const p6 = new Position('position6', 0);
    const p7 = new Position('position7', 0);

    const t1 = new Transition('transition1');
    const t2 = new Transition('transition2');
    const t3 = new Transition('transition3');
    const t4 = new Transition('transition4');

    const a1 = new Arc('acr p1 - t1', 1, t1, p1);
    const a2 = new Arc('acr t1 - p1', 1, p1, t1);
    const a3 = new Arc('acr t1 - p2', 1, p2, t1);
    const a4 = new Arc('acr t1 - p4', 1, p4, t1);
    const a5 = new Arc('acr t1 - p6', 1, p6, t1);
    const a6 = new Arc('acr p2 - t2', 2, t2, p2);
    const a7 = new Arc('acr p2 - t3', 1, t3, p2);
    const a8 = new Arc('acr p4 - t3', 1, t3, p4);
    const a9 = new Arc('acr t2 - p3', 1, p3, t2);
    const a10 = new Arc('acr p6 - t4', 1, t4, p6);
    const a11 = new Arc('acr t3 - p5', 1, p5, t3);
    const a12 = new Arc('acr p5 - t4', 1, t4, p5);
    const a13 = new Arc('acr t4 - p7', 1, p7, t4);

    t1.inArcs.push(a1);
    t1.outArcs.push(a2, a3, a4, a5);

    t2.inArcs.push(a6);
    t2.outArcs.push(a9);

    t3.inArcs.push(a7, a8);
    t3.outArcs.push(a11);

    t4.inArcs.push(a12, a10);
    t4.outArcs.push(a13);

    const posList = new Array();
    posList.push(p1, p2, p3, p4, p5, p6, p7);

    const tranList = new Array();
    tranList.push(t1, t2, t3, t4);

    const model = new Model(posList, tranList);
    model.simulate(100);
}

main();
