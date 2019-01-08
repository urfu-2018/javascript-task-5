'use strict';

function getFriendsNames(friendsMap, invitedFriends, invitingFriendsNames) {
    const friendsNames = new Set();

    for (const friendName of invitingFriendsNames) {
        const friends = friendsMap
            .get(friendName)
            .friends
            .filter(f => !invitedFriends.has(f));

        for (const friend of friends) {
            friendsNames.add(friend);
        }
    }

    return Array.from(friendsNames).sort((a, b) => a.localeCompare(b));
}

function getGuests(friends, maxLevel = Infinity) {
    // let level = maxLevel;
    const friendsMap = new Map();
    friends.forEach(friend => friendsMap.set(friend.name, friend));

    let invitingFriendsNames = friends
        .filter(f => f.best)
        .map(f => f.name)
        .sort((a, b) => a.localeCompare(b));

    const guests = [];
    const invitedFriends = new Set();

    for (let i = 0; i < maxLevel; i++) {
        for (const name of invitingFriendsNames) {
            guests.push(friendsMap.get(name));
            invitedFriends.add(name);
        }

        invitingFriendsNames = getFriendsNames(friendsMap, invitedFriends, invitingFriendsNames);

        if (invitingFriendsNames.length === 0) {
            break;
        }

        // level--;
    }

    return guests;
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

    this.friends = friends.filter(filter.predicate);
    this.index = 0;

    this.next = function () {
        return this.done() ? null : this.friends[this.index++];
    };

    this.done = function () {
        return this.index >= this.friends.length;
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
    Iterator.call(this, getGuests(friends, maxLevel), filter);
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
