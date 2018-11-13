'use strict';

const assert = require('assert');

function localCompareFriends(first, second) {
    const names = [first, second].map(friend => friend.name);

    return names[0].localeCompare(names[1]);
}

function iterateOver(friends, filter, depth = Infinity) {
    let currentFriends = friends.filter(friend => friend.best);

    const answer = [];
    const passed = [];
    let currentDepth = 1;

    while (currentDepth <= depth && currentFriends.length > 0) {
        currentFriends.forEach(someone => passed.push(someone));
        const satisfied = currentFriends.sort(localCompareFriends);
        satisfied.filter(filter.predicate)
            .forEach(someone => answer.push(someone));
        currentFriends = satisfied
            .map(someone => someone.friends)
            .reduce((array, friendsOfFriends) => array.concat(friendsOfFriends), [])
            .map(friendName => friends.find(someone => someone.name === friendName))
            .filter(Boolean)
            .filter(someone => !passed.includes(someone));
        currentDepth++;
    }

    return answer;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    this.containment = [];
    if (friends && filter) {
        assert(Filter.prototype.isPrototypeOf(filter));
        this.containment = iterateOver(friends, filter);
    }
    this.getContainment = () => this.containment;
}

Iterator.prototype.done = function () {
    return this.getContainment().length === 0;
};

Iterator.prototype.next = function () {
    return this.getContainment().shift();
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
    assert(Filter.prototype.isPrototypeOf(filter));
    this.containment = iterateOver(friends, filter, maxLevel);
    this.getContainment = () => this.containment;
}
LimitedIterator.prototype = new Iterator(null, null);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.predicate = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Object.setPrototypeOf(this, new Filter());

    this.predicate = someone => someone.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Object.setPrototypeOf(this, new Filter());

    this.predicate = someone => someone.gender === 'female';
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
