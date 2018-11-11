'use strict';

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

    this.result = getGuests(friends).filter(filter.filter);
    this.index = 0;
    this.next = function () {
        if (!this.done()) {
            return this.result[this.index++];
        }

        return null;
    };

    this.done = function () {
        return !(this.index < this.result.length);
    };
}

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
    this.result = getGuests(friends, maxLevel).filter(filter.filter);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filter = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filter = friend => friend.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filter = friend => friend.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

function getGuests(friends, maxLevel = Infinity) {
    let friendsByName = new Map();
    friends.forEach(friend => {
        friendsByName.set(friend.name, friend);
    });

    let currentFriends = friends
        .filter(f => f.best)
        .sort((a, b) => a.name > b.name);

    let guests = [];
    while (currentFriends.length > 0 && maxLevel > 0) {
        guests = guests.concat(currentFriends);
        maxLevel--;
        currentFriends = getNextLevelFriends(currentFriends, guests, friendsByName);
    }

    return guests;
}

function getNextLevelFriends(friends, guests, friendsByName) {
    return friends
        .reduce((result, friend) => result.concat(friend.friends), [])
        .map(name => friendsByName.get(name))
        .filter(friend => !guests.includes(friend))
        .sort((a, b) => a.name > b.name);
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
