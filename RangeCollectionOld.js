class Range {

    constructor(rangeArray) {
        this.from = rangeArray[0];
        this.to = rangeArray[1];

        if (isNaN(this.from) || isNaN(this.to)) {
            throw new Error(`Illegal argument exception: from (${this.from}) and to (${this.to}) should be numbers.`);
        }

        if (this.from > this.to) {
            throw new Error(`'from' (${this.from}) can't be more then 'to' (${this.to})`);
        }
    }

    isEmpty() {
        return this.from === this.to;
    }

    hasIntersection(otherRange) {
        return this.contains(otherRange.from) || this.contains(otherRange.to) || otherRange.contains(this.from)
            || this.from === otherRange.to || this.to === otherRange.from;
    }

    contains(num) {
        return num >= this.from && num < this.to;
    }

    /**
     * Join ranges if it needed
     * @param otherRange {Range}
     * @returns {Range[]}
     */
    join(otherRange) {
        if (this.hasIntersection(otherRange)) {
            return [new Range([Math.min(this.from, otherRange.from), Math.max(this.to, otherRange.to)])];
        }

        if (this.from > otherRange.to) {
            return [otherRange, this];
        } else {
            return [this, otherRange];
        }
    }

    /**
     * Exclude ranges if it needed
     * @param otherRange {Range}
     * @returns {Range[]}
     */
    exclude(otherRange) {
        let res = [];
        if (this.contains(otherRange.from) && this.from !== otherRange.from) {
            res.push(new Range([this.from, otherRange.from]));
        }

        if (this.contains(otherRange.to)) {
            res.push(new Range([otherRange.to, this.to]));
        }

        return res;
    }

    toString() {
        return `[${this.from}, ${this.to})`;
    }
}


class RangeCollection {

    constructor() {
        /**
         * Ordered ranges collection
         * @type {Array}
         */
        this.ranges = [];
    }

    /**
     * Adds a range to the collection
     * @param {Array<number>} rangeArray - Array of two integers that specify beginning and end of range.
     */
    add(rangeArray) {
        const newRange = new Range(rangeArray);
        if (newRange.isEmpty()) {
            return;
        }

        if (!this.ranges.length) {
            this.ranges.push(newRange);
            return;
        }

        this.ranges = this.ranges.reduce((result, range) => {
            return result.concat(result.pop().join(range));
        }, [newRange]);

    }

    /**
     * Removes a range from the collection
     * @param {Array<number>} rangeArray - Array of two integers that specify beginning and end of range.
     */
    remove(rangeArray) {
        if (!this.ranges.length) {
            return;
        }

        const excludeRange = new Range(rangeArray);
        this.ranges = this.ranges.reduce((result, range) => {
            return result.concat(range.exclude(excludeRange));
        }, []);
    }

    print() {
        return this.ranges.join(' ');
    }

    // static binarySearch(num, rangesArray) {
    //     let leftBorder = 0;
    //     let rightBorder = rangesArray.length;
    //     let processIndex;
    //
    //     while (leftBorder < rightBorder) {
    //         processIndex = Math.floor((leftBorder + rightBorder) / 2);
    //         if (num < rangesArray[processIndex].to) {
    //             rightBorder = processIndex;
    //         } else if (rangesArray[processIndex].contains(num)) {
    //             leftBorder = processIndex;
    //         } else {
    //             leftBorder = processIndex + 1;
    //         }
    //     }
    //
    //     return leftBorder;
    // }
}

module.exports = RangeCollection;
