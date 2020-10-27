const Element = require('./Element');
const Channel = require('./Channel');
const Patient = require('./Patient');

class Process extends Element {
    constructor(delay, deviation, name, distribution, maxqueue = 0, maxChannels = 1) {
        super(delay, deviation, name, distribution);
        this.queue = [];
        this.maxqueue = maxqueue;
        this.failure = 0;
        this.maxQueueLength = 0;
        this.avgQueueLength = 0;
        this.avgLoad = 0;
        this.maxLoad = 0;
        this.currentLoad = 0;
        this.maxChannels = maxChannels;
        this.channels = [...new Array(maxChannels)].map(_ => new Channel());
    }

    inAct(patient) {
        if (this.hasFreeChannels()) {
            const channel = this.getFreeChannel();
            channel.state = 1;
            channel.tnext = this.tcurr + this.getDelay();
            channel.patient = patient;
        } else {
            if (this.queue.length < this.maxqueue) {
                this.queue.push(patient);
            } else {
                this.failure++;
            }
        }
    }

    outAct() {
        super.outAct();

        const channels = this.getMinTnextChannels();
        const patients = [];
        channels.forEach(channel => {
            channel.tnext = Number.MAX_VALUE;
            channel.state = 0;
            patients.push(channel.patient);
            channel.patient = null;
        });

        if (this.queue.length > 0) {
            const patient = this.queue.pop();
            const channel = this.getFreeChannel();
            if (channel) {
                channel.state = 1;
                channel.tnext = this.tcurr + this.getDelay();
                channel.patient = patient;
            }
        }

        for (let i = 0; i < channels.length; i++) {
            const next = this.getNextElement();
            next.inAct(patients[i]);
            if (next.name === 'Despose') {
                Patient.avgTime += this.tcurr - patients[i].time;
            }
        }
    }

    printInfo() {
        super.printInfo();
        console.log(`failure = ${this.failure}`);
    }

    doStatistics(delta) {
        const busyChannels = this.channels.filter(ch => ch.state === 1).length;
        this.avgQueueLength += this.queue.length * delta;
        this.avgLoad += busyChannels / this.maxChannels * delta;
        if (this.queue.length > this.maxQueueLength) {
            this.maxQueueLength = this.queue.length;
        }

        if (busyChannels > this.maxLoad) {
            this.maxLoad = busyChannels;
        }
    }

    hasFreeChannels() {
        return !!this.channels.find(channel => channel.state === 0);
    }

    getFreeChannel() {
        return this.channels.find(channel => channel.state === 0);
    }

    getMinTnextChannels() {
        const min = this.getTnext();

        return this.channels.filter(channel => channel.tnext === min && channel.state === 1);
    }

    getTnext() {
        let min = this.channels[0].tnext;
        for (let i = 0; i < this.maxChannels; i++) {
            if (this.channels[i].tnext < min) {
                min = this.channels[i].tnext
            }
        }

        return min;
    }

    getNextElement() {
        if (this.nextElements.length === 1) {
            return this.nextElements[0].element;
        }

        let min = 0, max = 0;
        let index = 0;
        let nextElements = this.nextElements;

        for (let i = 0; i < nextElements.length; i++) {
            if (nextElements[i].priority > max) {
                max = nextElements[i].priority;
                index = i;
            }
        }

        if (min === max) {
            const probabilities = [];
            nextElements.forEach((el, i) => {
                if (i === 0) {
                    probabilities.push(el.probability);
                } else {
                    probabilities.push(probabilities[i - 1] + el.probability);
                }
            });

            const random = Math.random();
            index = probabilities.findIndex(el => el >= random);
            if (index === -1) {
                index = 0;
            }
        }

        return nextElements[index].element;
    }

    printInfo() {
        console.log(`${this.name} - ${this.channels.filter(ch => ch.state === 1).length}`);
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