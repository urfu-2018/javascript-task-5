'use strict';

function getGuests(friends, maxTier = Infinity) {
    const friendsMap = new Map(friends.map(friend => [friend.name, friend]));

    let currentTier = friends.filter(f => f.best)
        .map(f => f.name)
        .sort((a, b) => a.localeCompare(b));

    let guests = [];
    for (; maxTier > 0; maxTier--) {
        guests = guests.concat(currentTier);
        currentTier = getNextTierGuests(currentTier, guests, friendsMap);
        if (currentTier.length === 0) {
            break;
        }
    }

    return guests.map(g => friendsMap.get(g));
}

function getNextTierGuests(currentTier, guests, friendsMap) {
    const newGuests = new Set();
    currentTier.forEach(currentFriend =>
        friendsMap.get(currentFriend)
            .friends
            .filter(friend => !guests.includes(friend))
            .forEach(x => newGuests.add(x)));

    return [...newGuests].sort((a, b) => a.localeCompare(b));
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    this.guests = getGuests(friends, this.maxLevel)
        .filter(filter.predicate);
    this.index = 0;
}

Iterator.prototype = {
    constructor: Iterator,
    next: function () {
        return this.done() ? null : this.guests[this.index++];
    },

    done: function () {
        return !(this.index < this.guests.length);
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
    this.gender = undefined;
    this.predicate = function (record) {
        return !this.gender || this.gender === record.gender;
    }.bind(this);
}

const filterPrototype = new Filter();

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Filter.call(this);
    this.gender = 'male';
}

MaleFilter.prototype = filterPrototype;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Filter.call(this);
    this.gender = 'female';
}

FemaleFilter.prototype = filterPrototype;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
