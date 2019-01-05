'use strict';

function bestFriends(friends) {
    return sorts(friends.filter(friend => friend.best));
}

function searchFriends(newFriendsList, checkList, friends, person) {
    for (let element of friends) {
        if (person.friends.includes(element.name) && !checkList.includes(element)) {
            newFriendsList.push(element);
        }
    }

    return newFriendsList;
}

function sorts(friend) {
    return friend.sort((a, b) => a.name < b.name);
}

function pushNewElement(filter, nowValue, checkList, finalFriendsList) {
    if (filter.filter(nowValue) && !checkList.includes(nowValue)) {
        finalFriendsList.push(nowValue);
    }

    return finalFriendsList;
}

function sortListOfFriends(friends, filter, maxLevel) {
    let bestFriendsList = bestFriends(friends);
    let result = [];
    let checkList = [];
    let currentFriendsList = [];
    while (bestFriendsList.length && maxLevel > 0) {
        let nowValue = bestFriendsList.pop();
        result = pushNewElement(filter, nowValue, checkList, result);
        checkList.push(nowValue);
        currentFriendsList = sorts(searchFriends(currentFriendsList, checkList, friends, nowValue));
        if (!bestFriendsList.length) {
            maxLevel -= 1;
            bestFriendsList = currentFriendsList;
            currentFriendsList = [];
        }
    }

    return result;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('');
    }
    this.friends = sortListOfFriends(friends, filter, Infinity);
    this.index = 0;
    this.done = function () {
        return this.index >= this.friends.length;
    };

    this.next = function () {
        return this.done() ? null : this.friends[this.index++];
    };
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
    Iterator.call(this, friends, filter);
    this.friends = sortListOfFriends(friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = Filter;

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
    Filter.call(this);
    this.filter = function (friend) {
        return friend.gender === 'male';
    };
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = Filter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Filter.call(this);
    this.filter = function (friend) {
        return friend.gender === 'female';
    };
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = Filter;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
