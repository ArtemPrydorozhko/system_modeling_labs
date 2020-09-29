class Model {
    constructor(delayCreate, delayProcess, maxQueue = 0) {
        this.delayCreate = delayCreate;
        this.delayProcess = delayProcess;
        this.t0 = this.tcurr = this.tnext = 0.0;
        this.t1 = Number.MAX_VALUE;
        this.maxQueue = maxQueue;
        this.queue = 0;
        this.state = 0;
        this.numCreated = 0;
        this.numProcessed = 0;
        this.failure = 0;
        this.awaitingTimes = new Array();
        this.loadList = new Array();
        this.queuesLength = new Array();
    }

    simulate(timeModeling) {
        while (this.tcurr < timeModeling) {
            this.tnext = this.t0;
            this.nextEvent = 0;

            if (this.t1 < this.tnext) {
                this.tnext = this.t1;
                this.nextEvent = 1;
            }

            this.awaitingTimes.push((this.tnext - this.tcurr) * this.queue);
            this.loadList.push((this.tnext - this.tcurr) * this.state);

            this.tcurr = this.tnext;
            switch (this.nextEvent) {
                case 0:
                    this.event0();
                    break;
                case 1:
                    this.event1();
                    break;
            }

            //this.printInfo();
            this.queuesLength.push(this.state);
        }
        this.printResult();
    }

    event0() {
        this.t0 = this.tcurr + this.getTimeOfCreate();
        this.numCreated++;

        if (this.state === 0) {
            this.state = 1;
            this.t1 = this.tcurr + this.getTimeOfProcess();
        } else {
            if (this.queue < this.maxQueue)
                this.queue++;
            else
                this.failure++;
        }
    }

    event1() {
        this.t1 = Number.MAX_VALUE;
        this.state = 0;
        if (this.queue > 0) {
            this.queue--;
            this.state = 1;
            this.t1 = this.tcurr + this.getTimeOfProcess();
        }
        this.numProcessed++;
    }

    printInfo() {
        console.log(`t = ${this.tcurr}; state = ${this.state}; queue = ${this.queue}`);
    }

    printResult() {
        console.log(`${this.delayCreate} \t\t${this.delayProcess} \t\t${this.maxQueue} \t\t${this.numCreated} \t\t${this.numProcessed} \t\t${this.failure} \t\t${this.getAvgAwaitingTime().toFixed(5)} \t${this.getAvgLoad().toFixed(5)};`
                    + ` \t${this.getProbability().toFixed(5)} \t${this.getAvgQueueLength().toFixed(5)}`);
        // console.log(`delayCreate = ${this.delayCreate}; delayProcess = ${this.delayProcess}; maxQueue = ${this.maxQueue}; numCreated = ${this.numCreated};`
        //             + ` numProcessed = ${this.numProcessed}; failure = ${this.failure}; avgAwaiting = ${this.getAvgAwaitingTime()}; avgLoad = ${this.getAvgLoad()};`
        //             + ` probability = ${this.getProbability()}; avgQueue = ${this.getAvgQueueLength()}`);
    }

    getAvgAwaitingTime() {
        return this.awaitingTimes.reduce((acc, curr) => acc + curr, 0) / this.numProcessed;
    }

    getAvgQueueLength() {
        return this.awaitingTimes.reduce((acc, curr) => acc + curr, 0) / this.tnext;
    }

    getAvgLoad() {
        return this.loadList.reduce((acc, curr) => acc + curr, 0) / this.tnext;
    }

    getProbability() {
        return this.failure / this.numCreated;
    }

    getTimeOfProcess() {
        return this.expRand(this.delayProcess);
    }

    getTimeOfCreate() {
        return this.expRand(this.delayCreate);
    }

    expRand(timeMean) {
        const a = Math.random();
        return -timeMean * Math.log(a);
    }
}

function main() {
    console.log(`delayCreate \tdelayProcess \tmaxQueue \tnumCreated \tnumProcessed \tfailure \tavgAwaiting \tavgLoad \tprobability \tavgQueue`);
    // console.log('default');
    let model = new Model(2, 1, 5);
    model.simulate(1000);

    // console.log('\nincrease intensity');
    model = new Model(1, 1, 5);
    model.simulate(1000);

    // console.log('\ndecrease intensity');
    model = new Model(4, 1, 5);
    model.simulate(1000);

    // console.log('\ndecrease processing time');
    model = new Model(2, 0.5, 5);
    model.simulate(1000);

    // console.log('\nincrease processing time');
    model = new Model(2, 4, 5);
    model.simulate(1000);

    // console.log('\ndecrease max queue');
    model = new Model(2, 1, 2);
    model.simulate(1000);

    // console.log('\nincrease max queue');
    model = new Model(2, 1, 10);
    model.simulate(1000);
}

main();