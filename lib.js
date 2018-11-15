/* eslint-disable no-empty-function */
'use strict';

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
}

Filter.prototype.isValid = function () {
    return true;
};


/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;
MaleFilter.prototype.isValid = function (friend) {
    return friend.gender === 'male';
};

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;
FemaleFilter.prototype.isValid = function (friend) {
    return friend.gender === 'female';
};

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

    this._index = 0;
    this._maxLevel = Number.POSITIVE_INFINITY;
    this._friends = friends;
    this._filter = filter;
}

Iterator.prototype = {
    constructor: Iterator,

    get _friendsLinerization() {
        if (this._linerization === undefined) {
            this._linerization = this._linearizeFriends(this._friends)
                .filter(this._filter.isValid);
        }

        return this._linerization;
    },

    _linearizeFriends(friends) {
        const result = [];
        const alreadyInvited = new Set();
        const nameToFriendMap = new Map(friends.map(friend => [friend.name, friend]));

        let currentCircle = friends
            .filter(friend => friend.best)
            .sort((u, v) => u.name.localeCompare(v.name))
            .filter(friend => alreadyInvited.add(friend.name) && true);

        while (this._maxLevel > 0 && currentCircle.length > 0) {
            result.push(...currentCircle);
            currentCircle = this._getFriendsFor(currentCircle, alreadyInvited, nameToFriendMap);
            this._maxLevel--;
        }

        return result;
    },

    _getFriendsFor(people, alreadyInvited, nameToFriendMap) {
        const result = [];

        people.forEach(friend =>
            friend.friends
                .filter(friendOfFriend => !alreadyInvited.has(friendOfFriend))
                .forEach(friendOfFriend => {
                    alreadyInvited.add(friendOfFriend);
                    result.push(nameToFriendMap.get(friendOfFriend));
                })
        );

        return result.sort((u, v) => u.name.localeCompare(v.name));
    },

    done() {
        return this._index >= this._friendsLinerization.length;
    },

    next() {
        return !this.done() ? this._friendsLinerization[this._index++] : null;
    }
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
    Iterator.call(this, friends, filter);
    this._maxLevel = maxLevel;
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;


exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
