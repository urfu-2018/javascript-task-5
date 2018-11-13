'use strict';

function getGuests(friends, maxLevel = Infinity) {
    let friendsMap = new Map(friends.map(friend => [friend.name, friend]));
    let currLevel = 0;
    let currLevelFriends = friends
        .filter(friend => friend.best)
        .sort((a, b) => a.name > b.name);

    let guests = [];
    while (currLevel < maxLevel) {
        guests = guests.concat(currLevelFriends);
        currLevelFriends = getNextLevelFriends(currLevelFriends, guests, friendsMap);
        if (currLevelFriends.length === 0) {
            break;
        }
        currLevel++;
    }

    return guests;
}

function getNextLevelFriends(currLevelFriends, guests, friendsMap) {
    let nextLevelGuests = [];
    for (let currFriend of currLevelFriends) {
        nextLevelGuests.push(...currFriend.friends
            .map(name => friendsMap.get(name))
            .filter(friend => !guests.includes(friend)));
    }

    return nextLevelGuests.sort((a, b) => a.name > b.name);
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

    this.guests = getGuests(friends, this.maxLevel).filter(filter.condition);
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

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.condition = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Filter.call(this);
    this.condition = person => person.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Filter.call(this);
    this.condition = person => person.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
