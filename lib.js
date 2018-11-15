'use strict';

const localCompareFriends = (x, y) => x.name.localeCompare(y.name);

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
    this.friends = friends;
    this.index = 0;
    this.sortedFriends = this.getGuestList(this._maxLevel)
        .filter(filter.filterFriends);
}

Iterator.prototype = {
    next() {
        return this.index < this.sortedFriends.length
            ? this.sortedFriends[this.index++] : null;
    },
    done() {
        return this.index === this.sortedFriends.length;
    },

    getBestFriends: function () {
        return this.friends
            .filter(friend => friend.best)
            .sort(localCompareFriends);
    },

    getGuestList(maxLevel = Infinity) {
        let sortedFriends = [];
        let currentFriends = this.getBestFriends();
        let currentLevel = 0;
        while (currentLevel < maxLevel && currentFriends.length !== 0) {
            sortedFriends.push(...currentFriends);
            currentFriends = this.getNextLevel(currentFriends, sortedFriends);
            currentLevel += 1;
        }

        return sortedFriends;
    },

    getNextLevel(currentFriends, sortedFriends) {
        let nextLevelNames = currentFriends
            .map(friend => friend.friends)
            .reduce((acc, val) => acc.concat(val), []);
        let nextLevel = nextLevelNames
            .map(name => this.friends.find(x => x.name === name))
            .filter(friend => !sortedFriends.includes(friend));

        return [...new Set(nextLevel)].sort(localCompareFriends);
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
    this._maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype, LimitedIterator);

const getAllFriends = () => true;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filterFriends = getAllFriends;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filterFriends = friend => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype, MaleFilter);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filterFriends = friend => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype, FemaleFilter);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
