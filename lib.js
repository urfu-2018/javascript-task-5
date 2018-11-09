'use strict';

const MALE = 'male';
const FEMALE = 'female';

function sortFriends(friends) {
    return friends.slice().sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
}

function filterFriends(friends, filter) {
    const filteredFriends = [];
    const arrayLength = friends.length;
    for (let i = 0; i < arrayLength; i++) {
        if (filter.isSuitable(friends[i])) {
            filteredFriends.push(friends[i]);
        }
    }

    return filteredFriends;
}

function tryGetNext(thisObject, filter) {
    for (let i = thisObject.pointer; i < thisObject.currentFriendCycle.length; i++) {
        if (filter.isSuitable(thisObject.currentFriendCycle[i])) {
            return i;
        }
    }

    return -1;
}

function getNextCycle(thisObject, friendsStorage) {
    // Линтер ругается, если использовать this здесь, поэтому придется передавать его явно
    const nextCycle = [];
    thisObject.currentFriendCycle.forEach(friend => {
        friend.friends.forEach(friendOfFriend => {
            if (!thisObject.invited.has(friendOfFriend)) {
                nextCycle.push(friendsStorage.get(friendOfFriend));
                thisObject.invited.add(friendOfFriend);
            }
        });
    });

    return sortFriends(nextCycle);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    friends = sortFriends(friends);

    if (filter.constructor !== Filter) {
        throw new TypeError('filter must be a type of Filter');
    }

    const bestFriendFilter = {
        isSuitable(friend) {
            return friend.best;
        }
    };
    Object.setPrototypeOf(bestFriendFilter, new Filter());
    this.currentFriendCycle = filterFriends(friends, bestFriendFilter);
    this.invited = new Set(this.currentFriendCycle.map(friend => friend.name));
    this.maxLevel = Infinity;
    this.pointer = 0;

    let currentLevel = 1;
    const friendsStorage = new Map();
    friends.forEach(friend => friendsStorage.set(friend.name, friend));

    this.done = function () {
        if (tryGetNext(this, filter) !== -1) {
            return false;
        }
        const nextCycle = getNextCycle(this, friendsStorage);
        if (currentLevel++ < this.maxLevel && nextCycle.length !== 0) {
            this.currentFriendCycle = nextCycle;
            this.pointer = 0;

            return this.done();
        }

        return true;
    };

    this.next = function () {
        if (!this.done()) {
            const friendIndex = tryGetNext(this, filter);
            this.pointer = friendIndex + 1;

            return this.currentFriendCycle[friendIndex];
        }

        return null;
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
    const limitedIterator = Object.create(new Iterator(friends, filter));
    limitedIterator.maxLevel = maxLevel;

    return limitedIterator;
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isSuitable = function (friend) {
        return Boolean(friend);
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    const filter = new Filter();

    const maleFilter = Object.create(filter);
    maleFilter.isSuitable = function (friend) {
        return friend.gender === MALE;
    };

    return maleFilter;
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    const filter = new Filter();

    const femaleFilter = Object.create(filter);
    femaleFilter.isSuitable = function (friend) {
        return friend.gender === FEMALE;
    };

    return femaleFilter;
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
