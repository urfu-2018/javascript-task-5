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
    this.getFriends = (allFriends, filterFriends, maxLevel = Infinity) => {
        let bestFriends = friends
            .filter(friend => friend.best)
            .sort((a, b) => a.name.localeCompare(b.name));
        let currFriends = [];

        while (bestFriends.length > 0 && maxLevel > 0) {
            currFriends.push(...bestFriends);
            bestFriends = bestFriends
                .reduce((listFriends, friend) => listFriends.concat(friend.friends), [])
                .map(name => allFriends.find(friend => friend.name === name))
                .filter((friend, ind, arr) => !currFriends.includes(friend) &&
                    arr.indexOf(friend) === ind)
                .sort((a, b) => a.name.localeCompare(b.name));
            maxLevel -= 1;
        }

        return currFriends.filter(filterFriends.filter);
    };
    this.friends = this.getFriends(friends, filter, this.maxLevel);
    this.done = () => this.friends.length === 0;
    this.next = () => this.done() ? null : this.friends.shift();
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
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filter = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filter = (friend) => friend.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filter = (friend) => friend.gender !== 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
