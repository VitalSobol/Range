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
   * @returns Range
   */
  join(otherRange) {
    if (otherRange && this.hasIntersection(otherRange)) {
      return new Range([Math.min(this.from, otherRange.from), Math.max(this.to, otherRange.to)]);
    }

    return this;
  }

  /**
   * Exclude ranges if it needed
   * @param otherRange {Range}
   * @returns {Range}
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

  constructor(ranges) {
    /**
     * Ordered ranges collection
     * @type {Array}
     */
    this.ranges = ranges || [];
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

    const firstRange = this._binarySearch((temp) => newRange.from > temp.to) + 1;
    const lastRange = this._binarySearch((temp) => newRange.to >= temp.from);

    this.ranges.splice(firstRange, lastRange - firstRange + 1,
      newRange.join(this.ranges[firstRange]).join(this.ranges[lastRange]));
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
    if (excludeRange.isEmpty()) {
      return;
    }

    const firstRange = this._binarySearch((temp) => excludeRange.from >= temp.to) + 1;
    const lastRange = this._binarySearch((temp) => excludeRange.to > temp.from);

    this.ranges.splice(firstRange, lastRange - firstRange + 1,
      ...this.ranges[firstRange].exclude(excludeRange).concat(firstRange < lastRange ? this.ranges[lastRange].exclude(excludeRange) : []));
  }

  _binarySearch(isNewRangeBigger) {
    let start = -1;
    let end = this.ranges.length;
    while (end - start > 1) {
      const middleIndex = (start + end) >> 1;
      const middleElement = this.ranges[middleIndex];

      if (isNewRangeBigger(middleElement)) {
        start = middleIndex;
      } else {
        end = middleIndex;
      }
    }
    return isNewRangeBigger(start) ? end : start;
  }

  print() {
    return this.ranges.join(' ');
  }
}

module.exports = RangeCollection;
