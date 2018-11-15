'use strict';

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

    this.friends = getFriendsToInvite(friends).filter((arg) => filter.isSuitable(arg));
    this.position = 0;
}

Iterator.prototype.done = function () {
    return this.position >= this.friends.length;
};

Iterator.prototype.next = function () {
    return this.done() ? null : this.friends[this.position++];
};

function compareFriends(a, b) {
    return a.name.localeCompare(b.name);
}

function getBestFriends(friends) {
    return friends.filter(friend => friend.best).sort(compareFriends);
}

function getFriendsToInvite(friends, maxLevel = Infinity) {
    let invitations = [];
    if (maxLevel < 1) {
        return invitations;
    }

    let previousCircle = getBestFriends(friends);
    if (previousCircle.length === 0) {
        return invitations;
    }

    invitations = invitations.concat(previousCircle);
    for (let i = 1; i < maxLevel; i++) {
        previousCircle = getNextCircle(previousCircle, invitations, friends);

        if (!previousCircle.length) {
            break;
        }
        invitations = invitations.concat(previousCircle);
    }

    return invitations;
}

function getNextCircle(previousCircle, addedFriends, friends) {
    const candidateNames = [].concat(...previousCircle.map(friend => friend.friends));
    const candidates = candidateNames.map(name => friends.find(friend => name === friend.name));
    const alreadyInvited = friend => !addedFriends.includes(friend);
    const nextCircle = removeDuplicates(candidates.filter(alreadyInvited));

    return nextCircle.sort(compareFriends);
}

function removeDuplicates(arr) {
    return Array.from(new Set(arr));
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

    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    Object.setPrototypeOf(this, Iterator.prototype);
    this.friends = getFriendsToInvite(friends, maxLevel).filter((arg) => filter.isSuitable(arg));

    this.position = 0;
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filters = {};
}

Filter.prototype.isSuitable = function (friend) {
    return Object.keys(this.filters)
        .every(property => friend[property] === this.filters[property]);
};

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Object.setPrototypeOf(this, Filter.prototype);
    this.filters = {
        gender: 'male'
    };
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Object.setPrototypeOf(this, Filter.prototype);
    this.filters = {
        gender: 'female'
    };
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
