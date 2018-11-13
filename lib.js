'use strict';

function bestFriends(friends) {
    return sorts(friends.filter(f => f.best));
}

function searchFriends(newFriendsList, cheackList, friends, nowValue) {
    for (let element of friends) {
        let count = nowValue.friends.includes(element.name);
        if (count && !cheackList.includes(element)) {
            newFriendsList.push(element);
        }
    }

    return newFriendsList;
}

function sorts(friend) {
    return friend.sort(function (a, b) {
        return a.name < b.name;
    });
}

function pushNewElement(filter, nowValue, cheackList, finalFriendsList) {
    if (filter.filter(nowValue) && !cheackList.includes(nowValue)) {
        finalFriendsList.push(nowValue);
    }

    return finalFriendsList;
}

function sortedListFriends(friends, filter, maxLevel) {
    let bestFriendsList = bestFriends(friends);
    let finalFriendsList = [];
    let cheackList = [];
    let newFriendsList = [];
    while (maxLevel !== 0 && bestFriendsList.length && maxLevel > 0) {
        let nowValue = bestFriendsList.pop();
        finalFriendsList = pushNewElement(filter, nowValue, cheackList, finalFriendsList);
        cheackList.push(nowValue);
        newFriendsList = sorts(searchFriends(newFriendsList, cheackList, friends, nowValue));
        if (bestFriendsList.length === 0) {
            maxLevel -= 1;
            bestFriendsList = newFriendsList;
            newFriendsList = [];
        }
    }

    return finalFriendsList;
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
    this.friends = sortedListFriends(friends, filter, Infinity);
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
    this.friends = sortedListFriends(friends, filter, maxLevel);
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
