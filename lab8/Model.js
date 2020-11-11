const { table } = require('table');

class Model {
    constructor(positions, transitions) {
        this.positions = positions;
        this.transitions = transitions;
        this.event = 0;
    }

    simulate(timeModeling) {
        for (let i = 0; i < timeModeling; i++) {

            const nextTransitions = this.getAvailableTransitions();

            if (!nextTransitions.length) {
                break;
            }

            const nextTransition = this.getNextTransition(nextTransitions);

            nextTransition.startTransition();

            this.positions.forEach(pos => pos.CountStatistics());

            nextTransition.endTransition();
        }

        this.printResult(timeModeling);
    }

    getAvailableTransitions() {
        return this.transitions.filter(transition => transition.canStartTransition());
    }

    getNextTransition(availableTransitions) {
        const next = Math.floor(Math.random() * availableTransitions.length);
        return availableTransitions[next];
    }

    printResult(timeModeling) {
        let data = [['name', 'min markers', 'max markers', 'avg markers', 'total markers']];
        this.positions.forEach(position => {
            data.push([
                position.name,
                position.minMarkers,
                position.maxMarkers,
                position.avgMarkers / timeModeling,
                position.total,
            ])
        });
        console.log(table(data));
    }
}

module.exports = Model;
