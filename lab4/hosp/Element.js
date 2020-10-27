const Random = require('./Random');

class Element {
    constructor(delay, deviation, name, distribution) {
        this.tnext = this.tcurr = 0.0;
        this.delayMean = delay;
        this.state = 0;
        this.distribution = distribution;
        this.nextElements = new Array();
        this.quantity = 0;
        this.deviation = deviation;
        this.name = name;
    }

    getDelay(delayMean) {
        let delay = this.delayMean;
        delayMean = delayMean || this.delayMean;

        switch (this.distribution) {
            case 'exp':
                delay = Random.exp(delayMean);
                break;
            case 'uniform':
                delay = Random.uniform(delayMean, this.deviation);
                break;
            case 'erlang':
                delay = Random.erlang(delayMean, this.deviation);
                break;
        }

        return delay;
    }

    inAct() {}

    outAct() {
        this.quantity++;
    }

    printResult() {
        console.log(`${this.name} quantity = ${this.quantity}`);
    }

    printInfo() {
        console.log(`${this.name} state = ${this.state} quantity = ${this.quantity} tnext = ${this.tnext}`);
    }

    doStatistics() {}

    expRand(timeMean) {
        const a = Math.random();
        return -timeMean * Math.log(a);
    }
}

module.exports = Element;