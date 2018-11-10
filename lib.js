'use strict';

const sortByName = (first, second) => first.name > second.name;

function getOrderedFriends(friends, maxLevel = Infinity) {
    const friendsMap = createNameToFriendMap(friends);
    let result = [];
    let currentLevel = 0;
    let currentLevelFriends = friends
        .filter(friend => friend.best)
        .sort(sortByName);
    while (currentLevel < maxLevel && currentLevelFriends.length !== 0) {
        result.push(...currentLevelFriends);
        currentLevel++;
        currentLevelFriends = currentLevelFriends
            .reduce((accumulator, currentFriend) => [...accumulator, ...currentFriend.friends], [])
            .map(friendName => friendsMap.get(friendName))
            .filter((currentFriend, currentIdx, currentLevelAccumulator) =>
                !result.includes(currentFriend) &&
                currentLevelAccumulator.indexOf(currentFriend) === currentIdx)
            .sort(sortByName);
    }

    return result;
}

function createNameToFriendMap(friends) {
    let result = new Map();
    friends.forEach(friend => {
        result.set(friend.name, friend);
    });

    return result;
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
    this.friends = getOrderedFriends(friends).filter(filter.isFit);

    let current = 0;
    this.next = () => {
        if (current < this.friends.length) {
            return this.friends[current++];
        }

        return null;
    };

    this.done = () => current === this.friends.length;
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
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
    Iterator.call(this, friends, filter);
    this.friends = getOrderedFriends(friends, maxLevel).filter(filter.isFit);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isFit = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isFit = obj => obj.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isFit = obj => obj.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
