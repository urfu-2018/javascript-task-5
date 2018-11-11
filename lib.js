'use strict';

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

    this._friends = friends;
    this._filter = filter;
    this._friendsToInvite = this._getFriendsToInvite(this._maxLevel);

    this._index = 0;
}

Iterator.prototype = {

    _getFriendsToInvite(level = Infinity) {
        const friendsToInvite = new Set();

        let currentLevel = this._friends.filter(friend => friend.best);

        while (currentLevel.length !== 0 && level > 0) {
            currentLevel.sort((friend1, friend2) => friend1.name.localeCompare(friend2.name));
            currentLevel.forEach(friend => friendsToInvite.add(friend));

            currentLevel = this._getNextLevel(currentLevel, friendsToInvite);
            level--;
        }

        return Array.from(friendsToInvite).filter(friend => this._filter.test(friend));
    },

    _getNextLevel(level, friendsToInvite) {
        return level
            .reduce((friendNames, friend) => friendNames.concat(friend.friends), [])
            .map(friendName => this._friends.find(friend => friend.name === friendName))
            .filter(friend => !friendsToInvite.has(friend));
    },

    done() {
        return this._friendsToInvite[this._index] === undefined;
    },

    next() {
        return this.done() ? null : this._friendsToInvite[this._index++];
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

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.test = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.test = friend => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.test = friend => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
