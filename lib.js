'use strict';

function sortByName(friends) {
    friends.sort((friend1, friend2) => friend1.name > friend2.name ? 1 : -1);
}

function getBestFriends(friends) {
    return friends.filter(friend => friend.best);
}

function filterFriends(friends, filter) {
    return friends.filter(friend => filter.check(friend));
}

function checkForUniqueName(friendsObject, resultFriends) {
    return friendsObject.filter(name => resultFriends
        .every(resultFriend => resultFriend.name !== name));
}

function getNewNames(bestFriends, resultFriends) {
    return bestFriends.map(friend => checkForUniqueName(friend.friends, resultFriends))
        .reduce((resultArray, someArray) => resultArray.concat(someArray));

}

function getArrayOfObjectFriends(newNames, friends) {
    return newNames.map(name => friends.find(friend => friend.name === name));
}

function checkForUniqueObject(bestFriend, resultFriends) {
    return bestFriend.filter(friend => !resultFriends.includes(friend));
}

function getResultFriends(friends, filter, maxLvl = Infinity) {
    if (!maxLvl || maxLvl < 1) {
        return [];
    }
    let bestFriends = getBestFriends(friends);
    sortByName(bestFriends);
    if (bestFriends.length === 0) {
        return [];
    }
    let resultFriends = bestFriends;
    for (; maxLvl > 1; maxLvl--) {
        const newNames = getNewNames(bestFriends, resultFriends);
        if (newNames.length === 0) {
            break;
        }
        bestFriends = getArrayOfObjectFriends(newNames, friends);
        const checkedBestFriends = checkForUniqueObject(bestFriends, resultFriends);
        resultFriends = resultFriends.concat(checkedBestFriends);
    }

    return filterFriends(resultFriends, filter);
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
