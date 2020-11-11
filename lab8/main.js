const Arc = require('./Arc');
const Position = require('./Position');
const Transition = require('./Transition');
const Model = require('./Model');

function main() {
    task1();
    task2();
    task3();
}

function task1() {
    const p1 = new Position('creating A', 1);
    const p2 = new Position('awaiting A', 0);
    const p3 = new Position('requested A', 0);
    const p4 = new Position('confirmed A', 0);
    const p5 = new Position('sent A', 0);
    const p6 = new Position('recieved B', 0);
    const p7 = new Position('total recieved B', 0);

    const p8 = new Position('creating B', 1);
    const p9 = new Position('awaiting B', 0);
    const p10 = new Position('requested B', 0);
    const p11 = new Position('confirmed B', 0);
    const p12 = new Position('sent B', 0);
    const p13 = new Position('recieved A', 0);
    const p14 = new Position('total recieved A', 0);

    const p15 = new Position('control', 1);

    // const p16 = new Position('A is free', 1);
    // const p17 = new Position('B is free', 1);

    const t1 = new Transition('create A');
    const t2 = new Transition('request A');
    const t3 = new Transition('response A');
    const t4 = new Transition('send A');
    const t5 = new Transition('get B');
    const t6 = new Transition('send success B');

    const t7 = new Transition('create B');
    const t8 = new Transition('request B');
    const t9 = new Transition('response B');
    const t10 = new Transition('send B');
    const t11 = new Transition('get A');
    const t12 = new Transition('send success A');

    const a1 = new Arc('acr p1 - t1', 1, t1, p1);
    const a2 = new Arc('acr t1 - p1', 1, p1, t1);
    const a3 = new Arc('acr t1 - p2', 1, p2, t1);
    const a4 = new Arc('acr p2 - t2', 1, t2, p2);
    const a5 = new Arc('acr t2 - p3', 1, p3, t2);
    const a6 = new Arc('acr p3 - t3', 2, t3, p3);
    const a7 = new Arc('acr t3 - p4', 1, p4, t3);
    const a8 = new Arc('acr p4 - t4', 1, t4, p4);
    const a9 = new Arc('acr t4 - p5', 1, p5, t4);
    const a10 = new Arc('acr p5 - t5', 1, t5, p5);
    const a11 = new Arc('acr t5 - p6', 1, p6, t5);
    const a12 = new Arc('acr p6 - t6', 1, t6, p6);
    const a13 = new Arc('acr t6 - p7', 1, p7, t6);

    const a14 = new Arc('acr p8 - t7', 1, t7, p8);
    const a15 = new Arc('acr t7 - p8', 1, p8, t7);
    const a16 = new Arc('acr t7 - p9', 1, p9, t7);
    const a17 = new Arc('acr p9 - t8', 1, t8, p9);
    const a18 = new Arc('acr t8 - p10', 1, p10, t8);
    const a19 = new Arc('acr p10 - t9', 2, t9, p10);
    const a20 = new Arc('acr t9 - p11', 1, p11, t9);
    const a21 = new Arc('acr p11 - t10', 1, t10, p11);
    const a22 = new Arc('acr t10 - p12', 1, p12, t10);
    const a23 = new Arc('acr p12 - t11', 1, t11, p12);
    const a24 = new Arc('acr t11 - p13', 1, p13, t11);
    const a25 = new Arc('acr p13 - t12', 1, t12, p13);
    const a26 = new Arc('acr t12 - p14', 1, p14, t12);

    const a27 = new Arc('acr t6 - p15', 1, p15, t6);
    const a28 = new Arc('acr t12 - p15', 1, p15, t12);
    const a29 = new Arc('acr p15 - t4', 1, t4, p15);
    const a30 = new Arc('acr p15 - t10', 1, t10, p15);

    // const a31 = new Arc('acr t3 - p16', 1, p16, t3);
    // const a32 = new Arc('acr p16 - t1', 1, t1, p16);
    // const a33 = new Arc('acr t9 - p17', 1, p16, t9);
    // const a34 = new Arc('acr p17 - t7', 1, t7, p16);

    t1.inArcs.push(a1);
    t1.outArcs.push(a2, a3);
    t2.inArcs.push(a4);
    t2.outArcs.push(a5);
    t3.inArcs.push(a6);
    t3.outArcs.push(a7);
    t4.inArcs.push(a8, a29);
    t4.outArcs.push(a9);
    t5.inArcs.push(a10);
    t5.outArcs.push(a11);
    t6.inArcs.push(a12);
    t6.outArcs.push(a13, a27);

    t7.inArcs.push(a14);
    t7.outArcs.push(a15, a16);
    t8.inArcs.push(a17);
    t8.outArcs.push(a18);
    t9.inArcs.push(a19);
    t9.outArcs.push(a20);
    t10.inArcs.push(a21, a30);
    t10.outArcs.push(a22);
    t11.inArcs.push(a23);
    t11.outArcs.push(a24);
    t12.inArcs.push(a25);
    t12.outArcs.push(a26, a28);


    const posList = new Array();
    posList.push(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15);

    const tranList = new Array();
    tranList.push(t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12);

    const model = new Model(posList, tranList);
    model.simulate(100);
}

function task2() {
    const p1 = new Position('producer', 1);
    const p2 = new Position('buffer', 0);
    const p3 = new Position('consumer', 0);
    const p4 = new Position('restriction', 10);

    const t1 = new Transition('put');
    const t2 = new Transition('take');

    const a1 = new Arc('acr p1 - t1', 1, t1, p1);
    const a2 = new Arc('acr t1 - p1', 1, p1, t1);
    const a3 = new Arc('acr t1 - p2', 1, p2, t1);
    const a4 = new Arc('acr p2 - t2', 1, t2, p2);
    const a5 = new Arc('acr t2 - p3', 1, p3, t2);
    const a6 = new Arc('acr t2 - p4', 2, p4, t2);
    const a7 = new Arc('acr p4 - t1', 1, t1, p4);

    t1.inArcs.push(a1, a7);
    t1.outArcs.push(a2, a3);
    t2.inArcs.push(a4);
    t2.outArcs.push(a5, a6);

    const posList = new Array();
    posList.push(p1, p2, p3, p4);

    const tranList = new Array();
    tranList.push(t1, t2);

    const model = new Model(posList, tranList);
    model.simulate(100);
}

function task3() {
    const n = 20

    const p1 = new Position('create1', 1);
    const p2 = new Position('buffer1', 0);
    const p3 = new Position('processed1', 0);
    const p4 = new Position('create2', 1);
    const p5 = new Position('buffer2', 0);
    const p6 = new Position('processed2', 0);
    const p7 = new Position('create3', 1);
    const p8 = new Position('buffer3', 0);
    const p9 = new Position('processed3', 0);
    const p10 = new Position('resources', n);

    const t1 = new Transition('create1');
    const t2 = new Transition('process1');
    const t3 = new Transition('create2');
    const t4 = new Transition('process2');
    const t5 = new Transition('create3');
    const t6 = new Transition('process3');


    const a1 = new Arc('acr p1 - t1', 1, t1, p1);
    const a2 = new Arc('acr t1 - p1', 1, p1, t1);
    const a3 = new Arc('acr t1 - p2', 1, p2, t1);
    const a4 = new Arc('acr p2 - t2', 1, t2, p2);
    const a5 = new Arc('acr t2 - p3', 1, p3, t2);
    const a6 = new Arc('acr p10 - t2', n, t2, p10);
    const a7 = new Arc('acr t2 - p10', n, p10, t2);

    const a8 = new Arc('acr p4 - t3', 1, t3, p4);
    const a9 = new Arc('acr t3 - p4', 1, p4, t3);
    const a10 = new Arc('acr t3 - p5', 1, p5, t3);
    const a11 = new Arc('acr p5 - t4', 1, t4, p5);
    const a12 = new Arc('acr t4 - p6', 1, p6, t4);
    const a13 = new Arc('acr p10 - t4', Math.floor(n/3), t4, p10);
    const a14 = new Arc('acr t4 - p10', Math.floor(n/3), p10, t4);

    const a15 = new Arc('acr p7 - t5', 1, t5, p7);
    const a16 = new Arc('acr t5 - p7', 1, p7, t5);
    const a17 = new Arc('acr t5 - p8', 1, p8, t5);
    const a18 = new Arc('acr p8 - t6', 1, t6, p8);
    const a19 = new Arc('acr t6 - p9', 1, p9, t6);
    const a20 = new Arc('acr p10 - t6', Math.floor(n/2), t6, p10);
    const a21 = new Arc('acr t6 - p10', Math.floor(n/2), p10, t6);


    t1.inArcs.push(a1);
    t1.outArcs.push(a2, a3);
    t2.inArcs.push(a4, a6);
    t2.outArcs.push(a5, a7);

    t3.inArcs.push(a8);
    t3.outArcs.push(a9, a10);
    t4.inArcs.push(a11, a13);
    t4.outArcs.push(a12, a14);

    t5.inArcs.push(a15);
    t5.outArcs.push(a16, a17);
    t6.inArcs.push(a18, a20);
    t6.outArcs.push(a19, a21);

    const posList = new Array();
    posList.push(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);

    const tranList = new Array();
    tranList.push(t1, t2, t3, t4, t5, t6);

    const model = new Model(posList, tranList);
    model.simulate(100);
}

main();
