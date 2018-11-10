'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('azaazazazaza');
    }
    this.inv = getInvitedFriends(friends).filter(f => filter.filterOut(f));
    this.index = 0;
}

Iterator.prototype = {
    inv: [],
    index: 0,
    done() {
        return this.index === this.inv.length;
    },
    next() {
        return this.done() ? null : this.inv[this.index++];
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
    if (!(filter instanceof Filter)) {
        throw new TypeError('azaazazazaza');
    }
    this.inv = getInvitedFriends(friends, maxLevel)
        .filter(f => filter.filterOut(f));
    this.index = 0;
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

function getInvitedFriends(friends, maxDepth = friends.length) {
    let depth = 0;
    let result = [];
    let friendsToAdd = friends.filter(f => f.best);
    while (friendsToAdd.length > 0 && depth++ < maxDepth) {
        result = result.concat(friendsToAdd.sort((a, b) => a.name.localeCompare(b.name)));
        friendsToAdd = friendsOfFriendsNames(friendsToAdd, result, friends);
    }

    return result;
}

function friendsOfFriendsNames(friendsToAdd, invFriendsList, friends) {
    let result = [];
    let invFriendsNames = invFriendsList.map(f => f.name);
    for (let i = 0; i < friendsToAdd.length; i++) {
        let tmp = friendsToAdd[i].friends.filter(f => invFriendsNames.indexOf(f) === -1);
        result = result.concat(tmp);
    }

    return friends.filter(f => result.includes(f.name));
}


/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filterOut = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filterOut = (friend) => friend.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filterOut = (friend) => friend.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
