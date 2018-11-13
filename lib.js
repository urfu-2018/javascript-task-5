'use strict';

function localCompareFriends(first, second) {
    const names = [first, second].map(friend => friend.name);

    return names[0].localeCompare(names[1]);
}

function iterateOver(friends, filter, depth = Infinity) {
    let currentFriends = friends
        .filter(friend => friend.best)
        .sort(localCompareFriends);

    const answer = [];
    let currentDepth = 1;

    while (currentDepth <= depth && currentFriends.length > 0) {
        currentFriends.forEach(someone => answer.push(someone));
        currentFriends = currentFriends
            .map(friend => friend.friends)
            .reduce((array, friendsOfFriends) => array.concat(friendsOfFriends), [])
            .map(friendOfFriendName => friends.find(object => object.name === friendOfFriendName))
            // distinct
            .filter((someone, index, array) => array.indexOf(someone) === index)
            .filter(someone => answer.indexOf(someone) === -1)
            .sort(localCompareFriends);
        currentDepth++;
    }

    return answer
        .filter(Boolean)
        .filter(filter.predicate);
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
        this.containment = iterateOver(friends, filter);
    }
    this.getContainment = () => this.containment;
    this.index = 0;
}

Iterator.prototype.done = function () {
    return this.getContainment().length <= this.index;
};

Iterator.prototype.next = function () {
    const index = this.index;
    this.index++;

    return this.getContainment()[index];
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
    Iterator.apply(this, [friends, filter]);
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
