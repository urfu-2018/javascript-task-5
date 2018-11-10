'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('\'filter\' must be instance of Filter!');
    }
    this._friends = this._getCircles(friends)
        .filter(filter.check);
}

const compareNames = (a, b) => a.name.localeCompare(b.name);

Iterator.prototype = {
    constructor: Iterator,
    _counter: 0,
    _getCircles(friends, maxLevel = Infinity) {
        let currentCircle = friends.filter(_ => _.best).sort(compareNames);
        const circles = [];

        while (currentCircle.length > 0 && maxLevel-- > 0) {
            circles.push(...currentCircle);
            const nextCircle = this._getNextCircle(currentCircle, circles, friends);

            nextCircle.sort(compareNames);
            currentCircle = nextCircle;
        }

        return circles;
    },
    _getNextCircle(currentCircle, circles, friends) {
        const nextCircle = [];
        for (const friendName of currentCircle.reduce((acc, friend) =>
            acc.concat(friend.friends), [])) {
            const friend = friends.find(_ => _.name === friendName);
            if (!circles.includes(friend)) {
                nextCircle.push(friend);
            }
        }

        return nextCircle;
    },
    done() {
        return this._counter === this._friends.length;
    },
    next() {
        return (this.done()) ? null : this._friends[this._counter++];
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
    this._friends = this._getCircles(friends, maxLevel)
        .filter(filter.check);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');
}

Filter.prototype.check = (predicate, friend) => predicate(friend);

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');
}

MaleFilter.prototype = {
    constructor: MaleFilter,
    check(friend) {
        return super.check(person =>
            person.gender === 'male', friend);
    }
};
Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');
}

FemaleFilter.prototype = {
    constructor: FemaleFilter,
    check(friend) {
        return super.check(person =>
            person.gender === 'female', friend);
    }
};
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
