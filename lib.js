'use strict';

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

    this.friends = this.getFriendsOfFriends(friends, this.maxLevel)
        .filter(filter.isValid);
}

Iterator.prototype = {
    constructor: Iterator,
    getFriendsOfFriends(friends, maxLevel = Infinity) {
        let currentFriends = friends
            .filter(friend => friend.best)
            .sort((first, second) => first.name > second.name);
        const friendsOfFriends = [];

        while (currentFriends.length > 0 && maxLevel > 0) {
            friendsOfFriends.push(...currentFriends);

            currentFriends = currentFriends
                .reduce((acc, friend) => acc.concat(friend.friends), [])
                .map(name => friends.find(friend => friend.name === name))
                .filter((friend, index, arr) => !friendsOfFriends.includes(friend) &&
                    arr.indexof(friend) === index)
                .sort((first, second) => first.name > second.name);
            maxLevel -= 1;
        }

        return friendsOfFriends;
    },
    done() {
        return this.friends.length === 0;
    },
    next() {
        return this.done() ? null : this.friends.shift();
    }
};

/**
 * Итератор по друзьям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isValid = () => true;
}

/**
 * Фильтр друзей-парней
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isValid = (friend) => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = FemaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isValid = (friend) => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
