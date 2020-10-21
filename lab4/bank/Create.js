const Element = require('./Element');

class Create extends Element {
    constructor(delay, name) {
        super(delay, name);

        this.queueChanges = 0;
    }

    outAct() {
        super.outAct();
        this.tnext = this.tcurr + this.getDelay();
        
        this.getNextElement().inAct();

        this.checkQueue();
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

        const elLessQueue = nextElements.findIndex(el => el.element.queue < nextElements[index].element.queue);
        if (elLessQueue !== -1) {
            index = elLessQueue;
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

    checkQueue() {
        let maxQueue = this.nextElements[0].element.queue;
        let minQueue = this.nextElements[0].element.queue;
        let maxIndex = 0;
        let minIndex = 0;

        for (let i = 1; i < this.nextElements.length; i++) {
            const queue = this.nextElements[i].element.queue;
            if (queue > maxQueue){
                maxQueue = queue;
                maxIndex = i;
            } else if (queue < minQueue) {
                minQueue = queue;
                minIndex = i;
            }
        }

        if (maxQueue - minQueue > 1 && this.nextElements[minIndex].element.maxqueue >= this.nextElements[minIndex].element.queue + 1) {
            this.nextElements[minIndex].element.queue++;
            this.nextElements[maxIndex].element.queue--;
            this.queueChanges++;
        }
    }

    getTnext() {
        return this.tnext;
    }
}

module.exports = Create;
