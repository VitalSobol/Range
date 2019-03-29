const expect = require('chai').expect;
const RangeCollection = require('./RangeCollection.js');

describe('RangeCollection', () => {
    let rangeCollection;

    describe('add()', () => {
        beforeEach(() => {
            rangeCollection = new RangeCollection();
        });

        it('We add range, we expect that it add one range', () => {
            rangeCollection.add([1, 5]);
            return expect(rangeCollection.print()).to.equal('[1, 5)')
        });

        it('We add two not crossed ranges, we expect that it add two range', () => {
            rangeCollection.add([1, 5]);
            rangeCollection.add([10, 20]);
            return expect(rangeCollection.print()).to.equal('[1, 5) [10, 20)')
        });

        it('We add range with equal values, we expect that it change nothing', () => {
            rangeCollection.add([1, 5]);
            rangeCollection.add([20, 20]);
            return expect(rangeCollection.print()).to.equal('[1, 5)')
        });


        it('We add range and entering on end border range, we expect that it return one range', () => {
            rangeCollection.add([1, 5]);
            rangeCollection.add([5, 6]);
            return expect(rangeCollection.print()).to.equal('[1, 6)')
        });

        it('We add range and entering on start border range, we expect that it return one range', () => {
            rangeCollection.add([1, 5]);
            rangeCollection.add([0, 1]);
            return expect(rangeCollection.print()).to.equal('[0, 5)')
        });

        it('We add range and entering inside range, we expect that it change nothing', () => {
            rangeCollection.add([1, 5]);
            rangeCollection.add([2, 4]);
            return expect(rangeCollection.print()).to.equal('[1, 5)')
        });

        it('We add range and start inside and end outside range, we expect that it return one range', () => {
            rangeCollection.add([1, 5]);
            rangeCollection.add([3, 8]);
            return expect(rangeCollection.print()).to.equal('[1, 8)')
        });

        it('We add two not crossed ranges and one range which entering inside two ranges, we expect that it return one range', () => {
            rangeCollection.add([1, 5]);
            rangeCollection.add([10, 20]);
            rangeCollection.add([2, 12]);
            return expect(rangeCollection.print()).to.equal('[1, 20)')
        });
    });

    describe('remove()', () => {
        beforeEach(() => {
            rangeCollection = new RangeCollection();
            rangeCollection.add([1, 5]);
        });

        it('We remove range with equal values, we expect that it change nothing', () => {
            rangeCollection.remove([1, 1]);
            return expect(rangeCollection.print()).to.equal('[1, 5)')
        });

        it('We remove range entering on start border range, we expect that it return one range', () => {
            rangeCollection.remove([1, 2]);
            return expect(rangeCollection.print()).to.equal('[2, 5)')
        });

        it('We remove range entering on end border range, we expect that it return one range', () => {
            rangeCollection.remove([4, 5]);
            return expect(rangeCollection.print()).to.equal('[1, 4)')
        });

        it('We remove range entering inside range, we expect that it return two range', () => {
            rangeCollection.remove([2, 3]);
            return expect(rangeCollection.print()).to.equal('[1, 2) [3, 5)')
        });

        it('We remove range entering inside two ranges, we expect that it return two range', () => {
            rangeCollection.add([7, 10]);
            rangeCollection.remove([4, 8]);
            return expect(rangeCollection.print()).to.equal('[1, 4) [8, 10)')
        });

        it('We remove range around outside two ranges, we expect that it return empty range', () => {
            rangeCollection.add([7, 10]);
            rangeCollection.remove([0, 11]);
            return expect(rangeCollection.print()).to.equal('')
        });
    });

});
