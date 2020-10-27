class Random {
    static exp(timeMean) {
        const a = Math.random();
        return -timeMean * Math.log(a);
    }

    static uniform(from, to) {
        const a = Math.random();

        return from + a * (to - from);
    }

    static erlang(mean, k) {
        const O = mean / k;

        let r = 1;
        for (let i = 0; i < k; i++) {
            r *= Math.random();
        }

        return -O * Math.log(r);
    }
}

module.exports = Random;
