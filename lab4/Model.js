const { table } = require('table');

const Process = require('./Process');

class Model {
    constructor(list) {
        this.list = list;
        this.tcurr = this.tnext = 0.0;
        this.event = 0;
    }

    simulate(timeModeling) {
        while (this.tcurr < timeModeling) {
            this.tnext = Number.MAX_VALUE;

            for (const element of this.list) {
                if (element.getTnext() < this.tnext) {
                    this.tnext = element.getTnext();
                    this.event = this.list.indexOf(element);
                }
            }

            for (const element of this.list) {
                element.doStatistics(this.tnext - this.tcurr);
            }

            this.tcurr = this.tnext;

            for (const element of this.list) {
                element.tcurr = this.tcurr;
            }
            
            this.list[this.event].outAct();
            for (const element of this.list) {
                if (element.getTnext() === this.tcurr) {
                    element.outAct();
                }
            }
            // this.printInfo();
        }
        this.printResult();
    }

    printInfo() {
        for (const element of this.list) {
            if (element instanceof Process) {
                element.printInfo();
            }
        }
    }

    printResult() {
        const data = [['element', 'delay', 'maxqueue', 'avg loading', 'max loading', 'avg awaiting', 'avg queue', 'max queue', 'failure', 'failure prob']];
        for (const element of this.list) {
            if (element instanceof Process) {
                data.push([
                    element.name, element.delayMean, element.maxqueue, element.getAvgLoad(this.tcurr), element.maxLoad, element.getAvgAwaitingTime(),
                    element.avgQueueLength / this.tcurr, element.maxQueueLength, element.failure, element.getProbabilityOfFailure(),
                ]);
            } else {
                data.push([element.name, element.delayMean,'','','','','','','','']);
            }
        }
        console.log(table(data));
    }
}

module.exports = Model;
