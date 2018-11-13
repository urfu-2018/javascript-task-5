'use strict';

function sort(friend, anotherFriend) {
    if (friend.name < anotherFriend.name) {
        return -1;
    }

    if (friend.name > anotherFriend.name) {
        return 1;
    }

    return 0;
}

function getFriend(friends) {
    const res = [];

    for (const friend of friends) {
        if (friend) {
            res.push(friend.friends);
        }
    }

    return [].concat(...res);
}

function filterGuest(friends, filter, maxLevel) {
    const guests = [];
    let levelFriends = friends.filter(friend => friend.best).sort(sort);


    while (levelFriends.length > 0 && maxLevel > 0) {
        guests.push(...levelFriends);

        levelFriends = getFriend(levelFriends)
            .map(name => friends.find(friend => name === friend.name))
            .filter((friend, i, allFriends) => !guests.includes(friend) &&
                allFriends.indexOf(friend) === i)
            .sort(sort);

        maxLevel--;
    }

    return guests.filter(filter.__filter);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        return new TypeError();
    }

    this.invitedGuests = filterGuest(friends, filter, Infinity);
}

Iterator.prototype.done = function () {
    return this.invitedGuests.length === 0;
};

Iterator.prototype.next = function () {
    if (!this.done()) {
        return this.invitedGuests.shift();
    }

    return null;
};

LimitedIterator.prototype = Object.create(Iterator.prototype);

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
    this.invitedGuests = filterGuest(friends, filter, maxLevel);
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.__filter = () => true;
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.__filter = friend => friend.gender === 'male';
}

FemaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.__filter = friend => friend.gender === 'female';
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
