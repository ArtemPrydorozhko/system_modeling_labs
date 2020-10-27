const Process = require('./Process');

class Doctor extends Process {
    constructor(delay, deviation, name, distribution, maxqueue = 0, maxChannels = 1) {
        super(delay, deviation, name, distribution, maxqueue, maxChannels);
    }

    inAct(patient) {
        if (this.hasFreeChannels()) {
            const channel = this.getFreeChannel();
            channel.state = 1;
            channel.tnext = this.tcurr + this.getDelay(patient.registrationTime);
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
        this.quantity++;

        const channels = this.getMinTnextChannels();
        const patients = [];
        channels.forEach(channel => {
            channel.tnext = Number.MAX_VALUE;
            channel.state = 0;
            patients.push(channel.patient);
            channel.patient = null;
        });

        if (this.queue.length > 0) {
            let index = this.queue.findIndex(el => el.type === 1);
            if (index === -1) {
                index = 0;
            }

            const patient = this.queue[index];
            this.queue.splice(index, 1);
            const channel = this.getFreeChannel();
            if (channel) {
                channel.state = 1;
                channel.tnext = this.tcurr + this.getDelay(patient.registrationTime);
                channel.patient = patient;
            }
        }

        for (let i = 0; i < channels.length; i++) {
            const nextElement = patients[i].type === 1 ? 0 : 1;
            this.nextElements[nextElement].element.inAct(patients[i])
        }
    }
}

module.exports = Doctor;
