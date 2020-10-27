const Process = require('./Process');

class Laboratory extends Process {
    constructor(delay, deviation, name, distribution, maxqueue = 0, maxChannels = 1) {
        super(delay, deviation, name, distribution, maxqueue, maxChannels);

        this.lastIn = 0;
        this.avgIn = 0;
    }

    inAct(patient) {
        super.inAct(patient);

        this.avgIn += this.tcurr - this.lastIn;
        this.lastIn = this.tcurr;
    }

    outAct() {
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

        for (let i = 0; i < patients.length; i++) {
            if (patients[i].type === 2) {
                patients[i].type = 1;
                this.nextElements[0].element.inAct(patients[i])
            } else {
                this.nextElements[1].element.inAct(patients[i])
            }
        }

        this.quantity++;
    }
}

module.exports = Laboratory;
