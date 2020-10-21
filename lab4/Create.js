const Element = require('./Element');

class Create extends Element {
    constructor(delay, name) {
        super(delay, name);
    }

    outAct() {
        super.outAct();
        this.tnext = this.tcurr + this.getDelay();
        this.nextElements[0].inAct();
    }

    getTnext() {
        return this.tnext;
    }
}

module.exports = Create;
