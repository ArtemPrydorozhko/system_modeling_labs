class Patient {
    static first = 0;
    static second = 0;
    static third = 0;
    static avgTime = 0;
    constructor(type, probability, registrationTime) {
        this.type = type;
        this.probability = probability;
        this.registrationTime = registrationTime;
        this.time = 0;
    }
}

module.exports = Patient;
