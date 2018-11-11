'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} ffilter
 */
function Iterator(friends, ffilter) {
    if (!(ffilter instanceof Filter)) {
        throw new TypeError('filter must be instance Filter');
    }

    this.ffriends = this.getCircles(friends, this.maxLevel)
        .filter(ffilter.check);
}

function getNextCircle(currentCircle, circles, friends) {
    const nextCircle = [];

    currentCircle.forEach(curFriend =>
        curFriend.friends.forEach(name => {
            const friend = friends.find(person => person.name === name);
            if (!circles.includes(friend)) {
                nextCircle.push(friend);
            }
        })
    );

    return [...new Set(nextCircle)].sort((a, b) => a.name.localeCompare(b.name));
}

Iterator.prototype = {
    constructor: Iterator,
    done() {
        return this.ffriends.length === 0;
    },
    next() {
        return this.done() ? null : this.ffriends.shift();
    },
    getCircles(friends, maxLevel = Infinity) {
        let currentCircle = friends.filter(friend => friend.best)
            .sort((a, b) => a.name.localeCompare(b.name));
        const circles = [];

        while (currentCircle.length > 0 && maxLevel > 0) {
            circles.push(...currentCircle);
            currentCircle = getNextCircle(currentCircle, circles, friends);
            maxLevel--;
        }

        return circles;
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
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
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

Filter.prototype.check = () => true;

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');
}

MaleFilter.prototype = Object.create(Filter.prototype, {
    constructor: {
        value: MaleFilter
    },
    check: {
        value: friend => friend.gender === 'male'
    }
});

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');
}

FemaleFilter.prototype = Object.create(Filter.prototype, {
    constructor: {
        value: FemaleFilter
    },
    check: {
        value: friend => friend.gender === 'female'
    }
});

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
