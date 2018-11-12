'use strict';

function getFriendsForInviting(friends, maxLevel) {
    const friendsToInvite = [];
    friendsToInvite[0] = friends.filter(friend => friend.best);
    friends = friends.filter(friend => !friendsToInvite[0].includes(friend));
    for (let i = 1; i < maxLevel; i++) {
        friendsToInvite[i] = getNextLevelOfFriends(friendsToInvite[i - 1], friends);
        friends = friends.filter(friend => !friendsToInvite[i].includes(friend));
        if (friends.length === 0 || friendsToInvite[i].length === 0) {
            break;
        }
    }

    return friendsToInvite;
}

function getNextLevelOfFriends(friendsToInvite, allFriends) {
    const nextLevel = [];
    for (let prevLevelFriend of friendsToInvite) {
        allFriends.filter(friend => friend.friends.includes(prevLevelFriend.name))
            .map(friend => nextLevel.push(friend));
    }
    nextLevel.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    return nextLevel;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('filter should be an instance of Filter');
    }
    this.friendsToInvite = getFriendsForInviting(friends, Infinity)
        .reduce((flat, part) => flat.concat(part)); // .flat()
    this.friendsToInvite = filter.doFiltering(this.friendsToInvite).reverse();
}

Iterator.prototype.done = function () {
    return this.friendsToInvite.length === 0;
};

Iterator.prototype.next = function () {
    return this.friendsToInvite.pop();
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
    this.friendsToInvite = getFriendsForInviting(friends, maxLevel)
        .reduce((flat, part) => flat.concat(part)); // .flat()
    this.friendsToInvite = filter.doFiltering(this.friendsToInvite).reverse();
}
LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = /./;
}
Filter.prototype.doFiltering = function (friends) {
    return friends.filter(friend => friend.gender.match(this.gender));
};

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.gender = /^male/;
}
MaleFilter.prototype = Object.create(Filter.prototype);


/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.gender = /^female/;
}
FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
