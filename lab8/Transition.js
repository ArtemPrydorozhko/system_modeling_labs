class Transition {
    constructor(name) {
        this.name = name;
        this.inArcs = [];
        this.outArcs = [];
        this.active = false;
    }

    canStartTransition() {
        return this.inArcs.every(arc => arc.multiplicity <= arc.prevElement.markers);
    }

    getPositionMarkers() {
        this.inArcs.forEach(arc => arc.prevElement.markers -= arc.multiplicity);
    }

    returnPositionMarkers() {
        this.outArcs.forEach(arc => {
            arc.nextElement.markers += arc.multiplicity
            arc.nextElement.total += arc.multiplicity
            arc.nextElement.avgMarkers += arc.nextElement.markers;
        });
    }

    startTransition() {
        this.active = true;
        this.getPositionMarkers();
    }

    endTransition() {
        this.active = false;
        this.returnPositionMarkers();
    }
}

module.exports = Transition;
