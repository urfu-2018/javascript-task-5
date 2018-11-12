'use strict';

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);
Object.setPrototypeOf(BestFriendsFilter.prototype, Filter.prototype);
Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

function sortNamesLexicographic(friends) {
    return friends.sort((l, r) => l.name.localeCompare(r.name));
}

function firstCircle(friends) {
    const bestFriendFilter = new BestFriendsFilter();
    const friendSet = new Set();
    sortNamesLexicographic(bestFriendFilter.filter(friends))
        .forEach(e => {
            friendSet.add(e);
        });

    return friendSet;
}

function newCircle(previousCircle, accumulator, friendsMap) {
    const currentCircle = new Set();
    previousCircle.forEach(friend => {
        friend.friends.forEach(name => {
            currentCircle.add(friendsMap[name]);
        });
    });
    sortNamesLexicographic(Array.from(currentCircle))
        .forEach(person => {
            accumulator.add(person);
        });
}

function friendsToMap(friends) {
    const friendsMap = new Map();
    friends.forEach(friend => {
        friendsMap[friend.name] = friend;
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

    const friendsMap = friendsToMap(friends);
    const friendSet = firstCircle(friends);

    while (friendSet.size !== friends.length) {
        const prevLength = friendSet.size;
        newCircle(friendSet, friendSet, friendsMap);
        if (prevLength === friendSet.size) {
            break;
        }
    }

    if (friendSet.size < friends.length) {
        friends.forEach(friend => friendSet.add(friend));
    }

    this._collection = filter.filter(Array.from(friendSet));
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
    Iterator.call(this, friends, filter);

    const friendsMap = friendsToMap(friends);
    const friendSet = firstCircle(friends);

    while (maxLevel - 1 > 0) {
        const currentCircle = new Set();
        newCircle(friendSet, currentCircle, friendsMap);
        currentCircle.forEach(friend => friendSet.add(friend));
        maxLevel--;
    }

    this._collection = filter.filter(Array.from(friendSet));
    this._counter = 0;
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
