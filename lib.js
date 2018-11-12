'use strict';

function getNewFriends(friends) {
    return friends.reduce((newFriend, friend) => newFriend.concat(
        friend.friends.filter(name => !newFriend.includes(name))
    ), []);
}

function getFriends(friends, filter, max) {
    let guestList = [];
    let guest = friends.filter(friend => friend.best).sort(sortByName);
    let checkFriends = friend => !guestList.includes(friend);

    while (guest.length && max > 0) {
        guestList = guestList.concat(guest);
        guest = getNewFriends(guest)
            .map(name => friends.find(friend => friend.name === name))
            .filter(checkFriends)
            .sort(sortByName);
        max--;
    }

    return guestList.filter(friend => filter.filtering(friend));
}

function sortByName(a, b) {
    return a.name.localeCompare(b.name);
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

    this.friendsList = getFriends(friends, filter, Infinity);
    this.current = 0;
    this.done = function () {
        return this.friendsList.length === this.current;
    };
    this.next = function () {
        return this.done() ? null : this.friendsList[this.current++];
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
    this.friendsList = getFriends(friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filtering = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filtering = friend => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filtering = friend => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
