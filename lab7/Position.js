class Position {
    constructor(name, markers) {
        this.name = name;
        this.markers = markers;
        this.maxMarkers = 0;
        this.minMarkers = 0;
        this.avgMarkers = 0;
        this.total = 0;
    }

    CountStatistics() {
        if (this.markers > this.maxMarkers) {
            this.maxMarkers = this.markers;
        }
        if (this.markers < this.minMarkers) {
            this.minMarkers = this.markers;
        }
    }
}

module.exports = Position;
