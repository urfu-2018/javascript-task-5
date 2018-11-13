'use strict';

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

    this.current = 0;
    this.data = [];

    while (this.data.length !== friends.length) {
        const nextCircle = getNextUniqueCircle(friends, this.data);
        if (!nextCircle.length) {
            break;
        }

        this.data = this.data.concat(nextCircle);
    }

    this.data = this.data
        .concat(sortByName(getRestFriends(friends, this.data)))
        .filter((item) => filter.exec(item));
}

Iterator.prototype.done = function () {
    return this.current >= this.data.length;
};

Iterator.prototype.next = function () {
    if (this.done()) {
        return null;
    }

    return this.data[this.current++];
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
        throw new TypeError('filter should be an instance of Filter');
    }

    this.current = 0;
    this.data = [];

    for (let i = 0; i < maxLevel; i++) {
        const nextCircle = getNextUniqueCircle(friends, this.data);
        this.data = this.data.concat(nextCircle);
    }

    this.data = this.data.filter(item => filter.exec(item));
}

LimitedIterator.prototype = Iterator.prototype;

function getNextUniqueCircle(friends, invitations) {
    if (invitations.length === 0) {
        return sortByName(filterBest(friends));
    }

    const friendsOfInvitedFriends = invitations
        .map(fr => fr.friends)
        .reduce((acc, frSet) => acc.concat(frSet), [])
        .map(frName => friends.find(item => item.name === frName));

    const uniqueFriends = dedupe(friendsOfInvitedFriends)
        .filter(friend => invitations.indexOf(friend) === -1);

    return sortByName(uniqueFriends);
}

function getRestFriends(friends, invitations) {
    return friends.filter(fr => invitations.indexOf(fr) === -1);
}

function dedupe(arr) {
    return Array.from(new Set(arr));
}

function filterBest(friends) {
    return friends.filter(
        (friend) => friend.best,
    );
}

function sortByName(friends) {
    return friends.sort(
        (a, b) => a.name.localeCompare(b.name),
    );
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = null;
}

Filter.prototype.exec = function (item) {
    return !this.gender || item.gender === this.gender;
};

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.gender = 'male';
}

MaleFilter.prototype = Filter.prototype;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.gender = 'female';
}

FemaleFilter.prototype = Filter.prototype;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
