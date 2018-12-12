'use strict';

function getFriends(friends, filter, maxLevel) {
    if (!maxLevel || maxLevel < 1) {
        return [];
    }
    let getFriendsFriends = (currFriends, allFriends) => {
        return currFriends
            .reduce((listFriends, friend) => listFriends.concat(friend.friends), [])
            .map(name => allFriends.find(friend => friend.name === name))
            .filter((friend, ind, arr) => !currFriends.includes(friend) &&
                arr.indexOf(friend) === ind)
            .sort((a, b)=>a.name.localeCompare(b.name));
    };
    let bestFriends = friends
        .filter(friend => friend.best)
        .sort((a, b)=>a.name.localeCompare(b.name));
    for (let i = 1; i < maxLevel; i++) {
        let nextFriends = getFriendsFriends(bestFriends, friends);
        if (nextFriends.length) {
            bestFriends = bestFriends.concat(nextFriends);
        } else {
            break;
        }
    }

    return bestFriends.filter(filter.filter);
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
    this.friends = (!friends || !filter) ? [] : getFriends(
        friends, filter, this.maxLevel ? this.maxLevel : Infinity);
    this.i = 0;
    this.done = () => this.i >= this.friends.length;
    this.next = () => this.done() ? null : this.friends[this.i++];
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
