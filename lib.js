'use strict';

const MALE = 'male';
const FEMALE = 'female';

function sortFriends(friends) {
    return friends.slice().sort(function (a, b) {
        if (a.best && b.best) {
            return a.name.localeCompare(b.name);
        }
        if (a.best) {
            return -1;
        }
        if (b.best) {
            return 1;
        }

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

    this.friends = filterFriends(friends, filter);
    this.invited = new Set();

    this.pointer = 0;
    this.done = function () {
        return this.pointer === this.friends.length;
    };

    this.next = function () {
        if (!this.done()) {
            this.invited.add(this.friends[this.pointer].name);
            const friend = this.friends[this.pointer];
            this.pointer++;

            return friend;
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
    const bestFriendFilter = {
        isSuitable(friend) {
            return friend.best;
        }
    };
    Object.setPrototypeOf(bestFriendFilter, new Filter());

    let currentLevel = 1;
    let currentCycle = filterFriends(friends, bestFriendFilter);

    const limitedIterator = {
        friendsStorage: new Map(),
        done() {
            const isDone = super.done();
            if (isDone && currentLevel < maxLevel) {
                const friendsOfFriends = [];
                currentCycle.forEach(friend => {
                    friend.friends.forEach(name => {
                        if (!this.invited.has(name)) {
                            friendsOfFriends.push(this.friendsStorage.get(name));
                        }
                    });
                });
                currentLevel++;
                this.pointer = 0;
                currentCycle = filterFriends(sortFriends(friendsOfFriends), filter);
                this.friends = currentCycle;
            }

            return super.done();
        }
    };
    friends.forEach(friend => limitedIterator.friendsStorage.set(friend.name, friend));

    const iterator = new Iterator(currentCycle, filter);
    Object.setPrototypeOf(limitedIterator, iterator);

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
