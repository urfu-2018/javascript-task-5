'use strict';

function isMoreFriendly(friend1, friend2) {
    if (friend1.level !== friend2.level) {
        return friend1.level < friend2.level;
    }

    return friend1.name < friend2.name;
}

function compareFriends(friend1, friend2) {
    if (isMoreFriendly(friend1, friend2)) {
        return -1;
    }
    if (isMoreFriendly(friend2, friend1)) {
        return 1;
    }

    return 0;
}

function findNextLevelFriends(currentLevel, currentLevelFriends, visitedFriends, friendByName) {
    const nextLevelFriends = [];
    currentLevelFriends.forEach(friend => {
        friend.level = currentLevel;
        friend.friends.forEach(nextLevelFriendName => {
            const nextLevelFriend = friendByName.get(nextLevelFriendName);
            if (!visitedFriends.has(nextLevelFriend)) {
                nextLevelFriends.push(nextLevelFriend);
                visitedFriends.add(nextLevelFriend);
            }
        });
    });

    return nextLevelFriends;
}

function getNecessaryFriends(friends, filter) {
    let currentLevel = 1;
    let currentLevelFriends = friends.filter(friend => friend.best === true);
    const visitedFriends = new Set(currentLevelFriends);
    const friendByName = new Map(friends.map(friend => [friend.name, friend]));

    while (currentLevelFriends.length > 0) {
        currentLevelFriends = findNextLevelFriends(
            currentLevel, currentLevelFriends, visitedFriends, friendByName);
        currentLevel++;
    }

    return [...visitedFriends]
        .filter(friend => filter.isGoodFriend(friend))
        .sort(compareFriends);
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

    this.currentFriendIndex = 0;
    this.necessaryFriends = getNecessaryFriends(friends, filter);

    this.done = () => this.currentFriendIndex >= this.necessaryFriends.length;
    this.next = () => {
        return this.done() ? null : this.necessaryFriends[this.currentFriendIndex++];
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
    Iterator.call(this, friends, filter);
    this.necessaryFriends = this.necessaryFriends.filter(friend => friend.level <= maxLevel);
}
Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isGoodFriend = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isGoodFriend = (friend) => friend.gender === 'male';
}
Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isGoodFriend = (friend) => friend.gender === 'female';
}
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
