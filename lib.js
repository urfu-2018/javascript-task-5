'use strict';

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);
Object.setPrototypeOf(BestFriendsFilter.prototype, Filter.prototype);
Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

function sortNamesLexicographic(friends) {
    const friendsMap = friendsToMap(friends);
    let circleToSort = firstCircle(friends);
    const result = [];

    while (circleToSort.length > 0) {
        result.push(...circleToSort.sort((l, r) => l.name.localeCompare(r.name)));
        circleToSort = newCircle(circleToSort, friendsMap, result);
    }

    return result;
}

function firstCircle(friends) {
    const bestFriendFilter = new BestFriendsFilter();
    const friendSet = new Set();
    bestFriendFilter.filter(friends)
        .forEach(e => {
            friendSet.add(e);
        });

    return Array.from(friendSet);
}

function newCircle(previousCircle, friendsMap, listOfGuest) {
    const currentCircle = new Set();
    previousCircle.forEach(friend => {
        friend.friends.forEach(name => {
            if (typeof friendsMap.get(name) !== 'undefined' &&
                !listOfGuest.includes(friendsMap.get(name))) {
                currentCircle.add(friendsMap.get(name));
            }
        });
    });

    return Array.from(currentCircle);
}

function getFriendsBelowMaxLevel(friends, maxLevel) {
    const friendsMap = friendsToMap(friends);
    let friendsArray = firstCircle(friends);
    const notFilteredInvitedFriends = [];

    while (friendsArray.length > 0 && maxLevel > 0) {
        notFilteredInvitedFriends.push(...friendsArray);
        friendsArray = newCircle(friendsArray, friendsMap, notFilteredInvitedFriends);
        maxLevel--;
    }

    return notFilteredInvitedFriends;
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
 */
function Iterator(friends, filter) {
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

    this._collection = filter.filter(sortNamesLexicographic(friends));
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
    Iterator.call(this, getFriendsBelowMaxLevel(friends, maxLevel), filter);
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
