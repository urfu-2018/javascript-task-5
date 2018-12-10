'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('filter must be instance Filter');
    }

    this.friends = this.getCircles(friends, this.maxLevel)
        .filter(filter.check);
}

function getNextCircle(circle, circles, friends) {
    const nextCircle = [];

    circle.forEach(friend =>
        friend.friends.forEach(name => {
            const human = friends.find(person => person.name === name);
            if (!circles.includes(human)) {
                nextCircle.push(human);
            }
        })
    );

    return [...new Set(nextCircle)].sort((a, b) => a.name.localeCompare(b.name));
}

Iterator.prototype = {
    constructor: Iterator,
    done() {
        return this.friends.length === 0;
    },
    next() {
        return this.done() ? null : this.friends.shift();
    },
    getCircles(friends, maxLevel = Infinity) {
        let circle = friends.filter(friend => friend.best)
            .sort((a, b) => a.name.localeCompare(b.name));
        const circles = [];
        let i = maxLevel;
        while (circle.length > 0 && i > 0) {
            circles.push(...circle);
            circle = getNextCircle(circle, circles, friends);
            i--;
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
