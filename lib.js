'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('Filter must be of Filter type.');
    }
    this.friends = friends.reduce((res, cur) => {
        res[cur.name] = cur;

        return res;
    }, { null: null });
    this.filter = filter;
    this.level = [];
    this.nextLevel = friends.filter(friend => {
        return friend.best;
    }).map(friend => {
        return friend.name;
    });
    this.maxLevel = Infinity;
    this.used = new Set();
    this.levelID = 0;
    this.cache = null;
}

Iterator.prototype = {
    constructor: Iterator,

    updateLevel: function () {
        this.level = [...this.nextLevel].filter(friend => {
            return !this.used.has(friend);
        });
        this.nextLevel = new Set();
        if (this.level.length === 0 || this.levelID >= this.maxLevel) {
            this.level = [];

            return false;
        }
        this.levelID++;
        this.level.sort();

        return true;
    },

    getUnfilteredNext: function () {
        if (this.cache !== null) {
            const result = this.cache;
            this.cache = null;

            return result;
        }

        if (this.level.length === 0 && !this.updateLevel()) {
            return null;
        }
        const result = this.level[0];
        this.used.add(result);
        this.level = this.level.slice(1);
        this.friends[result].friends.forEach(friend => {
            this.nextLevel.add(friend);
        });

        return result;
    },

    nextName: function () {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const result = this.getUnfilteredNext();
            if (result === null || this.filter.check(this.friends[result])) {
                return result;
            }
        }
    },

    next: function () {
        return this.friends[this.nextName()];
    },

    done: function () {
        if (this.cache !== null) {
            return false;
        }
        this.cache = this.nextName();

        return this.cache === null;
    }
};

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    Iterator.call(this, friends, filter);
    this.maxLevel = maxLevel;
}

LimitedIterator.prototype = Object.create(Iterator.prototype, {
    constructor: {
        value: LimitedIterator
    }
});

/**
 * Фильтр друзей
 * @constructor
 */
// eslint-disable-next-line no-empty-function
function Filter() {}

Filter.prototype.check = () => true;

function filterGenderPrototypeFactory(constructor, gender) {
    return Object.create(Filter.prototype, {
        constructor: {
            value: constructor
        },
        check: {
            value: friend => friend.gender === gender
        }
    });
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
// eslint-disable-next-line no-empty-function
function MaleFilter() {}

MaleFilter.prototype = filterGenderPrototypeFactory(MaleFilter, 'male');

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
// eslint-disable-next-line no-empty-function
function FemaleFilter() {}

FemaleFilter.prototype = filterGenderPrototypeFactory(FemaleFilter, 'female');

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
