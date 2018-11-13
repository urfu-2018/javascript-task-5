'use strict';

function sortByName(friends) {
    return friends.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
}

function preparingListOfFriendsForIteration(friends, filter, maxLevel = Infinity) {
    const listOfFriends = [];

    let friendsAtLevel = sortByName(friends).filter(friend => friend.best);

    while (friendsAtLevel.length > 0 && maxLevel > 0) {
        listOfFriends.push(...friendsAtLevel);
        friendsAtLevel = sortByName();

        maxLevel--;
    }

    return listOfFriends.filter(filter.thisOneFits);
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

    this.friends = preparingListOfFriendsForIteration(friends, filter);
    this.index = -1;
}

Iterator.prototype.next = function () {
    if (!this.done()) {
        return null;
    }

    this.index++;

    return this.friends[this.index];
};

Iterator.prototype.done = function () {
    if (this.index === this.friends.length - 1) {
        return true;
    }

    return false;
};

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    this.friends = preparingListOfFriendsForIteration(friends, filter, maxLevel);
    this.index = -1;
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.thisOneFits = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.thisOneFits = friend => friend.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.thisOneFits = friend => friend.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
