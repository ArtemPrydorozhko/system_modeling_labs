class Arc {
    constructor(name, multiplicity, nextElement, prevElement) {
        this.multiplicity = multiplicity;
        this.name = name;
        this.nextElement = nextElement;
        this.prevElement = prevElement;
        this.probability = 1;
    }

}

module.exports = Arc;
