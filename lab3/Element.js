class Element {
    constructor(delay, name) {
        this.tnext = this.tcurr = 0.0;
        this.delayMean = delay;
        this.state = 0;
        this.distribution = 'exp';
        this.nextElements = new Array();
        this.quantity = 0;
        this.name = name;
    }

    getDelay() {
        let delay = this.delayMean;

        if (this.distribution === 'exp') {
            delay = this.expRand(this.delayMean);
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