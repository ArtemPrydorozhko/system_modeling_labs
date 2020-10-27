const Element = require('./Element');

class Create extends Element {
    constructor(delay, deviation, name, distribution, patients) {
        super(delay, deviation, name, distribution);

        this.patients = patients;
    }

    outAct() {
        super.outAct();
        this.tnext = this.tcurr + this.getDelay();
        const nextPatient = this.getNextPatient();
        this.nextElements[0].inAct({ ...nextPatient, time: this.tcurr });
    }

    getNextPatient() {
        const probabilities = [];
        this.patients.forEach((el, i) => {
            if (i === 0) {
                probabilities.push(el.probability);
            } else {
                probabilities.push(probabilities[i - 1] + el.probability);
            }
        });

        const random = Math.random();
        let index = probabilities.findIndex(el => el >= random);
        if (index === -1) {
            index = 0;
        }

        return this.patients[index];
    }

    getTnext() {
        return this.tnext;
    }
}

module.exports = Create;
