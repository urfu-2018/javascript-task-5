'use strict';

function sortByName(friend1, friend2) {
    return friend1.name.localeCompare(friend2.name);
}


function getNewNames(bestFriends) {
    return bestFriends.map(friend => friend.friends)
        .reduce((a, b) => a.concat(b));

}

function checkFriends(resultFriends) {
    return friend => !resultFriends.includes(friend);
}

function getResultFriends(friends, filter, maxLvl = Infinity) {
    if (!maxLvl || maxLvl < 1) {
        return [];
    }
    let bestFriends = friends.filter(friend => friend.best).sort(sortByName);
    let resultFriends = [];
    while (maxLvl > 0 && bestFriends.length > 0) {
        resultFriends = resultFriends.concat(bestFriends);
        bestFriends = Array.from(new Set(getNewNames(bestFriends)))
            .map(name => friends.find(human => human.name === name))
            .filter(checkFriends(resultFriends))
            .sort(sortByName);
        maxLvl--;
    }

    return resultFriends.filter(friend => filter.check(friend));
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

    this.resultFriends = getResultFriends(friends, filter);

}

Iterator.prototype.done = function () {
    return this.resultFriends.length === 0;
};

Iterator.prototype.next = function () {
    if (!this.done()) {
        return this.resultFriends.shift();
    }

    return null;
};

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    if (typeof maxLevel !== 'number' || maxLevel < 0) {
        maxLevel = 0;
    }
    this.resultFriends = getResultFriends(friends, filter, maxLevel);
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.check = () => true;
}


MaleFilter.prototype = new Filter();
FemaleFilter.prototype = new Filter();

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */


function MaleFilter() {
    this.check = (friend) => friend.gender === 'male';
}


/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.check = (friend) => friend.gender === 'female';
}


exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
