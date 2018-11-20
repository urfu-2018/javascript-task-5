'use strict';

const sortByName = (first, second) => first.name.localeCompare(second.name);

function getGuests(friends, maxLevel = Infinity) {
    let friendsMap = new Map(friends.map(friend => [friend.name, friend]));
    let currentLevel = 0;
    let currentLevelFriends = friends
        .filter(friend => friend.best)
        .sort(sortByName);

    let guests = [];
    while (currentLevel < maxLevel && currentLevelFriends.length !== 0) {
        guests = guests.concat(currentLevelFriends);
        currentLevelFriends = getNextLevelFriends(currentLevelFriends, guests, friendsMap);
        currentLevel++;
    }

    return guests;
}

function getNextLevelFriends(currentLevelFriends, guests, friendsMap) {
    let nextLevelGuests = new Set();
    for (let currentFriend of currentLevelFriends) {
        let nextFriends = currentFriend.friends
            .map(name => friendsMap.get(name))
            .filter(friend => !guests.includes(friend));
        for (let friend of nextFriends) {
            nextLevelGuests.add(friend);
        }
    }

    return Array.from(nextLevelGuests).sort(sortByName);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!Filter.prototype.isPrototypeOf(filter)) {
        throw new TypeError();
    }

    this.guests = getGuests(friends, this.maxLevel).filter(filter.predicate);
    this.index = 0;
}

Iterator.prototype = {
    constructor: Iterator,

    next() {
        return this.done() ? null : this.guests[this.index++];
    },

    done() {
        return this.index === this.guests.length;
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

LimitedIterator.prototype = Object.create(Iterator.prototype, LimitedIterator);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.predicate = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Filter.call(this);
    this.predicate = person => person.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype, MaleFilter);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Filter.call(this);
    this.predicate = person => person.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype, FemaleFilter);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
