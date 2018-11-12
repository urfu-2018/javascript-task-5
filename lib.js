'use strict';

function addPowerFor(friends, names, level) {
    var newNames = [];
    var buildFriends = [];
    for (var name of names) {
        if (friends.has(name)) {
            var friend = friends.get(name);
            buildFriends.push({ friend, power: level });
            friends.delete(name);
            newNames = newNames.concat(friend.friends);
        }
    }

    if (newNames.length > 0) {
        return buildFriends.concat(addPowerFor(friends, newNames, level + 1));
    }

    return buildFriends;
}

function addPowerFriend(friends) {
    var newFriends = [];
    var names = [];
    for (var friend of friends.values()) {
        if (friend.best) {
            names = names.concat(friend.friends);
            newFriends.push({ friend, power: 1 });
            friends.delete(friend.name);
        }
    }

    newFriends = newFriends
        .concat(addPowerFor(friends, names, 2))
        .concat(Array.from(friends.values()).map(f => {
            return { friend: f, power: Infinity };
        }));

    return newFriends;
}

function toMap(friends) {
    var map = new Map();
    for (var friend of friends) {
        map.set(friend.name, friend);
    }

    return map;
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
    var copyFriend = Array.from(friends);
    var current = 0;
    var f = addPowerFriend(toMap(copyFriend));
    this.selfFriends = f.sort((a, b) => {
        if (a.power === b.power) {
            return a.friend.name.localeCompare(b.friend.name);
        }
        if (a.power < b.power) {
            return -1;
        }

        return 1;

    });
    this.isCorrect = function (i) {
        return (
            i < this.selfFriends.length &&
            !filter.isCorrect(this.selfFriends[i].friend)
        );
    };
    this.done = function () {
        var i = current;
        while (this.isCorrect(i)) {
            i++;
        }

        return !(
            i < this.selfFriends.length && filter.isCorrect(this.selfFriends[i].friend)
        );
    };

    this.next = function () {
        if (this.done()) {
            return null;
        }

        while (this.isCorrect(current)) {
            current++;
        }
        current++;

        return this.selfFriends[current - 1].friend;
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
    this.isCorrect = function (i) {
        return (
            i < this.selfFriends.length &&
            !(
                filter.isCorrect(this.selfFriends[i].friend) &&
                this.selfFriends[i].power <= maxLevel
            )
        );
    };
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
