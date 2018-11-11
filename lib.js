'use strict';

class ArrayIterator {
    constructor(array) {
        this._array = array;
        this._length = array.length;
        this._nextIndex = 0;
    }

    next() {
        return this.done() ? null : this._array[this._nextIndex++];
    }

    done() {
        return this._nextIndex === this._length;
    }
}

class SimpleFilter {

    check() {
        return true;
    }

    filterAll(array) {
        const filtered = [];
        for (const element of array) {
            if (this.check(element)) {
                filtered.push(element);
            }
        }

        return filtered;
    }
}

class GenderFilter extends SimpleFilter {
    constructor(gender) {
        super();
        this._gender = gender;
    }

    check(friend) {
        return friend.gender === this._gender;
    }
}

function addAll(set, iterable) {
    for (const element of iterable) {
        set.add(element);
    }
}

class FriendPicker {
    constructor(friends) {
        this._friends = friends.slice();
        this._friends.sort((a, b) => a.name.localeCompare(b.name));
    }

    getFriends(depth) {
        const friends = this._friends.slice();
        const pickedFriends = [];
        let currentStepFriends = new Set(this._getBestFriends());
        for (let i = 0; i < depth && friends.length > 0; i++) {
            currentStepFriends = FriendPicker._performFriendPickStep(friends,
                currentStepFriends, pickedFriends);
        }

        return pickedFriends;
    }

    static _performFriendPickStep(friends, currentStepFriends, pickedFriends) {
        let nextStepFriends = new Set();
        for (let j = 0; j < friends.length; j++) {
            const friend = friends[j];
            if (currentStepFriends.has(friend.name)) {
                pickedFriends.push(friend);
                friends.splice(j, 1);
                j--;
                addAll(nextStepFriends, friend.friends);
            }
        }

        return nextStepFriends;
    }

    _getBestFriends() {
        const bestFriends = [];
        for (const friend of this._friends) {
            if (friend.best) {
                bestFriends.push(friend.name);
            }
        }

        return bestFriends;
    }

}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {SimpleFilter} filter
 */
function Iterator(friends, filter) {
    console.info(friends, filter);
    const pickedFriends = new FriendPicker(friends).getFriends(Number.MAX_SAFE_INTEGER);

    return new ArrayIterator(filter.filterAll(pickedFriends));
}

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {SimpleFilter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    console.info(friends, filter, maxLevel);
    const pickedFriends = new FriendPicker(friends).getFriends(maxLevel);

    return new ArrayIterator(filter.filterAll(pickedFriends));
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');

    return new SimpleFilter();
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');

    return new GenderFilter('male');
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');

    return new GenderFilter('female');
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
