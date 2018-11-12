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

function getCurrentCircleFriends(friendSet, friendsMap) {
    const currentCircle = new Set();
    friendSet.forEach(friend =>
        friend.friends.forEach(name =>
            currentCircle.add(friendsMap[name])
        )
    );

    return currentCircle;
}

function formCollectionOfInvitedFriends(friends, filter, maxLevel = Infinity) {
    const notFilteredInvited = new Set();

    let friendSet = firstCircle(friends);
    friendSet.forEach(friend => notFilteredInvited.add(friend));

    const friendsMap = friendsToMap(friends);
    for (let i = maxLevel - 1; i > 0; i--) {
        const currentCircle = getCurrentCircleFriends(friendSet, friendsMap);
        const previousInvitedListLength = notFilteredInvited.length;
        sortNamesLexicographic(Array.from(currentCircle))
            .forEach(friend => notFilteredInvited.add(friend));
        friendSet = currentCircle;
        if (notFilteredInvited.length === previousInvitedListLength) {
            break;
        }
    }

    if (maxLevel === Infinity && notFilteredInvited.length !== friends.length) {
        friends.forEach(friend => notFilteredInvited.add(friend));
    }

    return filter.filter(Array.from(notFilteredInvited));
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

    this._collection = formCollectionOfInvitedFriends(friends, filter, maxLevel);
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
    this.filter = function (friends) {
        return friends.filter(friend => friend.best);
    };
}

/**
 * Фильтр для друзей-парней
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filter = function (friends) {
        return friends.filter(friend => friend.gender === 'male');
    };
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filter = function (friends) {
        return friends.filter(friend => friend.gender === 'female');
    };
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
