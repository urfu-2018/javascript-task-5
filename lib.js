'use strict';

function getCycle(friends, prevCycle) {
    if (prevCycle === undefined) {
        return friends.filter(obj => obj.best).sort(compareFriends);
    }
    const cycle = [];
    const prevCycleNames = prevCycle.map(obj => obj.name);
    friends.forEach(function (friend) {
        if (friend.friends.some(function (f) {
            return prevCycleNames.indexOf(f) !== -1;
        })) {
            cycle.push(friend);
        }
    });

    return cycle.sort(compareFriends);
}

function getFilteredFriends(friends, filter, maxLevel = Infinity) {
    const copiedFriends = friends.slice();
    let filteredFriends = [];
    let prevCycle;
    while (maxLevel > 0 && copiedFriends.length !== 0) {
        const cycle = getCycle(copiedFriends, prevCycle);
        if (cycle.length === 0) {
            break;
        }
        cycle.forEach(function (friend) {
            if (filter.isOk(friend)) {
                filteredFriends.push(friend);
            }
            copiedFriends.splice(copiedFriends.indexOf(friend), 1);
        });
        maxLevel--;
        prevCycle = cycle;
    }

    return filteredFriends;
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
