'use strict';

function tryGetNext(thisObject, filter) {
    for (let i = thisObject.pointer; i < thisObject.potentialGuests.length; i++) {
        if (filter.useFilter(thisObject.potentialGuests[i])) {
            return i;
        }
    }

    return -1;
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

    friends = friends.sort((friend1, friend2) => friend1.name.localeCompare(friend2.name));
    const bestFriendFilter = new BestFriendFilter();

    this.potentialGuests = friends.filter(bestFriendFilter.useFilter);
    this.invited = new Set(this.potentialGuests.map(friend => friend.name));
    this.maxLevel = Infinity;
    this.pointer = 0;
    let currentLevel = 1;
    const friendsMap = new Map();

    friends.forEach(friend => friendsMap.set(friend.name, friend));

    this.done = function () {
        if (tryGetNext(this, filter) !== -1 && currentLevel <= this.maxLevel) {
            return false;
        }

        let levelFriends = [];
        this.potentialGuests.forEach(friend => {
            friend.friends.forEach(friendOfFriend => {
                if (!this.invited.has(friendOfFriend)) {
                    levelFriends.push(friendsMap.get(friendOfFriend));
                    this.invited.add(friendOfFriend);
                }
            });
        });

        levelFriends = levelFriends.sort((friend1, friend2) =>
            friend1.name.localeCompare(friend2.name));

        if (currentLevel++ < this.maxLevel && levelFriends.length !== 0) {
            this.potentialGuests = levelFriends;
            this.pointer = 0;

            return this.done();
        }

        return true;
    };

    this.next = function () {
        if (!this.done()) {
            const currentIndex = tryGetNext(this, filter);
            this.pointer = currentIndex + 1;

            return this.potentialGuests[currentIndex];
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
    this.useFilter = function () {
        return true;
    };
}

function BestFriendFilter() {
    const bestFriendFilter = Object.create(new Filter());
    bestFriendFilter.useFilter = friend => friend.best;

    return bestFriendFilter;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    const maleFilter = Object.create(new Filter());
    maleFilter.useFilter = friend => friend.gender === 'male';

    return maleFilter;
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    const femaleFilter = Object.create(new Filter());
    femaleFilter.useFilter = friend => friend.gender === 'female';

    return femaleFilter;
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
