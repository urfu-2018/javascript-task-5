'use strict';

const sortByName = (first, second) => first.name.localeCompare(second.name);

function getOrderedFriends(friends, maxLevel = Infinity) {
    const friendsMap = new Map(friends.map(friend => [friend.name, friend]));
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
}

Iterator.prototype = {
    current: 0,
    next() {
        if (!this.done()) {
            return this.friends[this.current++];
        }

        return null;
    },
    done() {
        return this.current === this.friends.length;
    }
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
