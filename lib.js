'use strict';

const MALE = 'male';
const FEMALE = 'female';

function sortFriends(friends) {
    return friends.slice().sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
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

    if (!(filter instanceof Filter)) {
        throw new TypeError('filter must be a type of Filter');
    }

    this.currentFriendCycle = friends.filter((friend) => friend.best);
    this.invited = new Set(this.currentFriendCycle.map(friend => friend.name));
    this.maxLevel = Infinity;
    this.pointer = 0;
    this.currentLevel = 1;
    this.friendsStorage = new Map();
    this.filter = filter;

    friends.forEach(friend => this.friendsStorage.set(friend.name, friend));
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
    this.maxLevel = maxLevel;
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
    this.isSuitable = function (friend) {
        return friend.gender === MALE;
    };
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isSuitable = function (friend) {
        return friend.gender === FEMALE;
    };
}

Iterator.prototype.done = function () {
    if (tryGetNext(this, this.filter) !== -1 && this.currentLevel <= this.maxLevel) {
        return false;
    }
    const nextCycle = getNextCycle(this, this.friendsStorage);
    if (this.currentLevel++ < this.maxLevel && nextCycle.length !== 0) {
        this.currentFriendCycle = nextCycle;
        this.pointer = 0;

        return this.done();
    }

    return true;
};

Iterator.prototype.next = function () {
    if (!this.done()) {
        const friendIndex = tryGetNext(this, this.filter);
        this.pointer = friendIndex + 1;

        return this.currentFriendCycle[friendIndex];
    }

    return null;
};

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
