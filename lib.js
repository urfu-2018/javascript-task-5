'use strict';


function getFilteredFriends(friends, filter, maxLevel = Infinity) {
    let cycle = friends.filter(friend => friend.best).sort(compareFriends);
    const sortedFriends = [];
    while (maxLevel > 0 && cycle.length > 0) {
        sortedFriends.push(...cycle);
        cycle = cycle
            .reduce((result, friend) => result.concat(friend.friends), [])
            .map(name => friends.find(friend => friend.name === name))
            .filter(function (friend, index, arr) {
                return (!sortedFriends.includes(friend) && arr.indexOf(friend) === index);
            })
            .sort(compareFriends);
        maxLevel--;
    }

    return sortedFriends.filter(filter.isOk);
}


function compareFriends(fr1, fr2) {
    return fr1.name.localeCompare(fr2.name);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    console.info(friends, filter);
    if (!(Filter.prototype.isPrototypeOf(filter))) {
        throw new TypeError();
    }

    this.pointer = -1;
    this.filteredFriends = getFilteredFriends(friends, filter);

}

Iterator.prototype.next = function () {
    if (this.pointer === this.filteredFriends.length - 1) {
        return null;
    }
    this.pointer++;

    return this.filteredFriends[this.pointer];
};

Iterator.prototype.done = function () {
    return this.pointer === this.filteredFriends.length - 1;
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
    console.info(friends, filter, maxLevel);
    Iterator.call(this, friends, filter);
    this.filteredFriends = getFilteredFriends(friends, filter, maxLevel);
}
LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');

    this.isOk = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');

    this.isOk = (friend) => friend.gender === 'male';
}
MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');

    this.isOk = (friend) => friend.gender === 'female';
}
FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
