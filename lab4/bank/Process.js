const Element = require('./Element');
const Channel = require('./Channel');

class Process extends Element {
    constructor(delay, name, maxqueue = 0, maxChannels = 1) {
        super(delay, name);
        this.queue = 0;
        this.maxqueue = maxqueue;
        this.failure = 0;
        this.maxQueueLength = 0;
        this.avgQueueLength = 0;
        this.avgLoad = 0;
        this.maxLoad = 0;
        this.currentLoad = 0;
        this.maxChannels = maxChannels;
        this.channels = [...new Array(maxChannels)].map(_ => new Channel());
        this.lastOut = 0;
        this.avgOutTime = 0;
    }

    inAct() {
        if (this.hasFreeChannels()) {
            const channel = this.getFreeChannel();
            channel.state = 1;
            channel.tnext = this.tcurr + this.getDelay();
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
        const channels = this.getMinTnextChannels();
        channels.forEach(channel => {
            channel.tnext = Number.MAX_VALUE;
            channel.state = 0;
        });
        if (this.queue > 0) {
            this.queue--;
            const channel = this.getFreeChannel();
            channel.state = 1;
            channel.tnext = this.tcurr + this.getDelay();
        }

        if (this.nextElements.length) {
            for (let i = 0; i < channels.length; i++) {
                this.getNextElement().inAct();
            }
        }

        this.avgOutTime += this.tcurr - this.lastOut;
        this.lastOut = this.tcurr;
    }

    printInfo() {
        console.log(`name = ${this.name}; queue = ${this.queue}; fail = ${this.failure}`);
    }

    doStatistics(delta) {
        const busyChannels = this.channels.filter(ch => ch.state === 1).length;
        this.avgQueueLength += this.queue * delta;
        this.avgLoad += busyChannels / this.maxChannels * delta;
        if (this.queue > this.maxQueueLength) {
            this.maxQueueLength = this.queue;
        }

        // if (this.state !== 0) {
        //     this.currentLoad += delta;
        //     if (this.currentLoad > this.maxLoad) {
        //         this.maxLoad = this.currentLoad;
        //     }
        // } else {
        //     this.currentLoad = 0;
        // }

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
        let nextElements = this.nextElements.filter(el => el.element.hasFreeChannels());
        if (!nextElements.length) {
            nextElements = this.nextElements;
        }

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

    getAvgAwaitingTime() {
        return this.avgQueueLength / this.quantity;
    }

    getAvgQueueLength(tcurr) {
        return this.avgQueueLength / tcurr;
    }

    getQuantity() {
        return this.quantity;
    }

    getAvgLoad(tcurr) {
        return this.avgLoad / tcurr;
    }

    getOutTime(tcurr) {
        return this.avgOutTime / tcurr;
    }

    getProbabilityOfFailure() {
        return this.failure / (this.failure + this.quantity);
    }
}

module.exports = Process;