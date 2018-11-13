'use strict';

function addPowerFor(friends, names, level, maxLevel) {
    var newNames = [];
    var buildFriends = [];
    if (level > maxLevel) {
        return [];
    }
    for (var name of names) {
        if (friends.has(name)) {
            var friend = friends.get(name);
            buildFriends.push(friend);
            friends.delete(name);
            newNames = newNames.concat(friend.friends);
        }
    }

    buildFriends = buildFriends.sort(sortFriend);

    if (newNames.length > 0 && level + 1 <= maxLevel) {
        return buildFriends.concat(addPowerFor(friends, newNames, level + 1, maxLevel));
    }

    return buildFriends;
}

function addPowerFriend(friends, maxLevel) {
    var newFriends = Array.from(friends.values()).filter(f => f.best)
        .sort(sortFriend);
    var names = [];
    for (var friend of newFriends) {
        names = names.concat(friend.friends);
        friends.delete(friend.name);
    }

    if (newFriends.length === 0 || maxLevel <= 0) {
        return [];
    }

    newFriends = newFriends
        .concat(addPowerFor(friends, names, 2, maxLevel));

    if (friends.size > 0 && !isFinite(maxLevel)) {
        newFriends = newFriends.concat(Array.from(friends.values()).sort(sortFriend));
    }

    return newFriends;
}

function toMap(friends) {
    var map = new Map();
    for (var friend of friends) {
        map.set(friend.name, friend);
    }

    return map;
}

function sortFriend(a, b) {
    return a.name.localeCompare(b.name);

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
    if (!(this instanceof LimitedIterator) && !this.maxLevel) {
        this.maxLevel = Infinity;
    }
    var copyFriend = Array.from(friends);

    this.selfFriends = addPowerFriend(toMap(copyFriend), this.maxLevel)
        .filter(e => filter.isCorrect(e));

    this.done = function () {
        return !(this.selfFriends.length > 0);
    };

    this.next = function () {
        if (this.done()) {
            return null;
        }

        return this.selfFriends.shift();
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
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isCorrect = function () {
        return true;
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Filter.call(this);
    this.isCorrect = function (friend) {
        return friend.gender === 'male';
    };
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Filter.call(this);
    this.isCorrect = function (friend) {
        return friend.gender === 'female';
    };
}

FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
