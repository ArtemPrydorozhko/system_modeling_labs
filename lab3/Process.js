const Element = require('./Element');

class Process extends Element {
    constructor(delay, name, maxqueue = 0) {
        super(delay, name);
        this.queue = 0;
        this.maxqueue = maxqueue;
        this.failure = 0;
        this.maxQueueLength = 0;
        this.avgQueueLength = 0;
        this.avgLoad = 0;
        this.tnext = Number.MAX_VALUE;
        this.maxLoad = 0;
        this.currentLoad = 0;
    }

    inAct() {
        if (this.state === 0) {
            this.state = 1;
            this.tnext = this.tcurr + this.getDelay();
        } else {
            if (this.queue < this.maxqueue) {
                this.queue++;
            } else {
                this.failure++;
            }
        }
    }

    outAct() {
        super.outAct();
        this.tnext = Number.MAX_VALUE;
        this.state = 0;
        if (this.queue > 0) {
            this.queue--;
            this.state = 1;
            this.tnext = this.tcurr + this.getDelay();
        }

        if (this.nextElements.length) {
            const i = Math.floor(Math.random() * this.nextElements.length);
            this.nextElements[i].inAct();
        }
    }

    printInfo() {
        super.printInfo();
        console.log(`failure = ${this.failure}`);
    }

    doStatistics(delta) {
        this.avgQueueLength += this.queue * delta;
        this.avgLoad += this.state * delta;
        if (this.queue > this.maxQueueLength) {
            this.maxQueueLength = this.queue;
        }

        if (this.state !== 0) {
            this.currentLoad += delta;
            if (this.currentLoad > this.maxLoad) {
                this.maxLoad = this.currentLoad;
            }
        } else {
            this.currentLoad = 0;
        }
    }

    getAvgAwaitingTime() {
        return this.avgQueueLength / this.quantity;
    }

    getAvgQueueLength(tcurr) {
        return this.avgQueueLength / tcurr;
    }

    getAvgLoad(tcurr) {
        return this.avgLoad / tcurr;
    }

    getProbabilityOfFailure() {
        return this.failure / (this.failure + this.quantity);
    }
}

module.exports = Process;