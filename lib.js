'use strict';

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);
Object.setPrototypeOf(BestFriendsFilter.prototype, Filter.prototype);
Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

function sortNamesLexicographic(one, another) {
    return one.name.localeCompare(another.name);
}

function firstCircle(friends) {
    const bestFriendFilter = new BestFriendsFilter();
    const friendSet = new Set();
    bestFriendFilter.filter(friends).sort(sortNamesLexicographic)
        .forEach(e => {
            friendSet.add(e);
        });

    return Array.from(friendSet);
}

function newCircle(previousCircle, friendsMap, listOfGuest) {
    const currentCircle = new Set();
    previousCircle.forEach(friend => {
        friend.friends.forEach(name => {
            if (!listOfGuest.includes(friendsMap.get(name))) {
                currentCircle.add(friendsMap.get(name));
            }
        });
    });

    return Array.from(currentCircle).sort(sortNamesLexicographic);
}

function getFilteredInvitedFriends(friends, filter, maxLevel) {
    const friendsMap = friendsToMap(friends);
    let friendsArray = firstCircle(friends);
    const notFilteredInvitedFriends = [];

    while (friendsArray.length > 0 && friendsArray.length > 0 && maxLevel > 0) {
        Array.from(friendsArray).forEach(friend =>
            notFilteredInvitedFriends.push(friend)
        );
        friendsArray = newCircle(friendsArray, friendsMap, notFilteredInvitedFriends);
        maxLevel--;
    }

    return filter.filter(notFilteredInvitedFriends);
}

function friendsToMap(friends) {
    const friendsMap = new Map();
    friends.forEach(friend => {
        friendsMap.set(friend.name, friend);
    });

    return friendsMap;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {number} maxLevel
 */
function Iterator(friends, filter, maxLevel = Infinity) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    this.next = function () {
        const result = this._collection[this._counter];
        this._counter++;

        return (typeof result === 'undefined') ? null : result;
    };

    this.done = function () {
        const result = this.next() === null;
        this._counter--;

        return result;
    };

    this._collection = getFilteredInvitedFriends(friends, filter, maxLevel);
    this._counter = 0;
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

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filter = function (friends) {
        return friends;
    };
}

/**
 * Фильтр лучших друзей
 * @extends Filter
 * @constructor
 */
function BestFriendsFilter() {
    this.filter = (friends) => friends.filter(friend => friend.best);
}

/**
 * Фильтр для друзей-парней
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filter = (friends) => friends.filter(friend => friend.gender === 'male');
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filter = (friends) => friends.filter(friend => friend.gender === 'female');
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
