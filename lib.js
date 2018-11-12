'use strict';

function getSortedFriends(friends, filter, maxLevel = Infinity) {
    let prevCircle = friends.filter(friend => friend.best).sort(compareFriends);
    const sortedFriends = [];

    while (maxLevel-- !== 0 && prevCircle.length !== 0) {
        sortedFriends.push(...prevCircle);
        const nextCircleNames = [];
        prevCircle.forEach(friend => nextCircleNames.push(...friend.friends));
        const nextCircle = nextCircleNames
            .map(name => friends.find(friend => friend.name === name))
            .filter(friend => !sortedFriends.includes(friend));
        prevCircle = [...new Set(nextCircle)].sort(compareFriends);
    }

    return sortedFriends.filter(filter.filterFriends);
}

function compareFriends(a, b) {
    return a.name.localeCompare(b.name);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    // console.info(friends, filter);
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
    this.sortedFriends = getSortedFriends(friends, filter);
}

Iterator.prototype = {
    constructor: Iterator,
    done: function () {
        return this.sortedFriends.length === 0;
    },
    next: function () {
        return this.sortedFriends.shift() || null;
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
    // console.info(friends, filter, maxLevel);
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
    this.sortedFriends = getSortedFriends(friends, filter, maxLevel);
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

Filter.prototype.filterFriends = () => true;

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');
}

MaleFilter.prototype = Object.create(Filter.prototype, {
    filterFriends: { value: friend => friend.gender === 'male' },
    constructor: { value: MaleFilter }
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
    filterFriends: { value: friend => friend.gender === 'female' },
    constructor: { value: FemaleFilter }
});

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
