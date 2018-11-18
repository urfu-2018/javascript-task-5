'use strict';

function sortName(a, b) {
    return a.name.localeCompare(b.name);
}


function findFriends(bestFriends, friends, invitedFriends) {
    let listFriends = [];
    bestFriends.forEach(friend => listFriends.push(...friend.friends));
    listFriends = listFriends.map(friendName => friends.find(friend => friend.name === friendName))
        .filter(friend => !invitedFriends.includes(friend));

    return listFriends;
}

function bypassWide(friends, filter, maxLevel = Infinity) {
    let bestFriends = friends.filter(friend => friend.best).sort(sortName);
    let invitedFriends = [];
    while (bestFriends.length > 0 && maxLevel > 0) {
        invitedFriends.push(...bestFriends);
        bestFriends = findFriends(bestFriends, friends, invitedFriends).sort(sortName);
        maxLevel--;
    }
    invitedFriends = invitedFriends.filter(filter.check).reverse();

    return invitedFriends;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */

function Iterator(friends, filter) {
    if (filter.constructor !== Filter) {
        throw new TypeError();
    }
    this.invitedFriends = bypassWide(friends, filter);
}

Iterator.prototype.done = function () {
    return !this.invitedFriends.length;
};

Iterator.prototype.next = function () {
    return this.done() ? null : this.invitedFriends.pop();
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
    if (filter.constructor !== Filter) {
        throw new TypeError();
    }
    Object.setPrototypeOf(this, Iterator.prototype);
    this.invitedFriends = bypassWide(friends, filter, maxLevel);
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.check = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    const malerFilter = Object.create(new Filter());
    malerFilter.check = friend => friend.gender === 'male';

    return malerFilter;
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    const femaleFilter = Object.create(new Filter());
    femaleFilter.check = friend => friend.gender === 'female';

    return femaleFilter;
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
