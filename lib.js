'use strict';

function sortByName(first, second) {
    return first.name.localeCompare(second.name);
}

function collectFriends(friends, maxLevel = Infinity) {
    const result = [];
    let levelIndex = 1;
    let currentLevelFriends = friends.filter(friend => friend.best);

    while (currentLevelFriends.length > 0 && levelIndex <= maxLevel) {
        result.push(...currentLevelFriends.sort(sortByName));

        currentLevelFriends = currentLevelFriends
            .reduce((acc, friend) => acc.concat(friend.friends), [])
            .map(name => friends.find(friend => friend.name === name))
            .filter(function (friend, index, arr) {
                return !result.includes(friend) && arr.indexOf(friend) === index;
            });
        levelIndex++;
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
        throw new TypeError('filter must be instance of Filter');
    }

    this.invited = collectFriends(friends)
        .filter(friend => filter.isCompatible(friend));
    this.currentIndex = 0;
}

Iterator.prototype = {
    invited: [],
    currentIndex: 0,
    done() {
        return this.currentIndex >= this.invited.length;
    },
    next() {
        return this.done() ? null : this.invited[this.currentIndex++];
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
    this.invited = collectFriends(friends, maxLevel)
        .filter(friend => filter.isCompatible(friend));
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isCompatible = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isCompatible = (friend) => friend.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isCompatible = (friend) => friend.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
