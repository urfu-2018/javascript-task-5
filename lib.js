'use strict';

function sortFriends(friend, anotherFriend) {
    return friend.name.localeCompare(anotherFriend.name);
}

function getFriendsName(friends) {
    return [].concat(...friends.map(friend => friend.friends));
}

function filterGuest(friends, filter, maxLevel) {
    const guests = [];
    let levelFriends = friends.filter(friend => friend.best).sort(sortFriends);

    while (levelFriends.length > 0 && maxLevel > 0) {
        guests.push(...levelFriends);

        levelFriends = getFriendsName(levelFriends)
            .map(name => friends.find(friend => name === friend.name))
            .filter((friend, i, allFriends) => !guests.includes(friend) &&
                allFriends.indexOf(friend) === i)
            .sort(sortFriends);

        maxLevel--;
    }

    return guests.filter(filter._filter);
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
    this._filter = () => true;
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this._filter = friend => friend.gender === 'male';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this._filter = friend => friend.gender === 'female';
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
