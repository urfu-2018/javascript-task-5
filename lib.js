'use strict';

function getFriendsNames(friendsMap, invitedFriends, invitingFriendsNames) {
    let friendsNames = [];

    for (const friendName of invitingFriendsNames) {
        friendsNames = friendsNames.concat(
            friendsMap.get(friendName)
                .friends
                .filter(f => f !== undefined && !invitedFriends.has(f))
        );
    }

    // console.info(friendsNames);

    return friendsNames.sort((a, b) => a.localeCompare(b));
}

function getGuests(friends, maxLevel) {
    let level = maxLevel;
    const friendsMap = new Map();
    friends.forEach(friend => friendsMap.set(friend.name, friend));

    let invitingFriendsNames = friends
        .filter(f => f.best)
        .map(f => f.name)
        .sort((a, b) => a.localeCompare(b));

    var guests = [];
    const invitedFriends = new Set();

    while (level !== 0) {
        for (const name of invitingFriendsNames) {
            guests.push(friendsMap.get(name));
            invitedFriends.add(name);
        }

        invitingFriendsNames = getFriendsNames(friendsMap, invitedFriends, invitingFriendsNames);

        if (invitingFriendsNames.length === 0) {
            break;
        }

        level--;
    }

    return guests;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel
 */
function Iterator(friends, filter, maxLevel = Infinity) {
    this.guests = getGuests(friends, maxLevel);

    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    this.index = 0;
    this.guests = this.guests.filter(filter.predicate);

    this.next = function () {
        return this.done() ? null : this.guests[this.index++];
    };

    this.done = function () {
        return (this.index >= this.guests.length);
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
    Iterator.call(this, friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

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
    this.predicate = friend => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.predicate = friend => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = LimitedIterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
