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

    console.info('-------------SIMPLE ITERATOR--------------');
    while (this.data.length !== friends.length) {
        console.info('--------------START ITERATION--------------');
        console.info('INVITED IS ', this.data);
        const nextCircle = getNextUniqueCicle(friends, this.data);
        console.info('GOT: ', nextCircle);
        if (!nextCircle.length) {
            break;
        }

        this.data = this.data.concat(nextCircle);
        console.info('--------------------END ITERATION--------------------');
    }

    this.data = this.data
        .concat(getRestFriends(friends, this.data))
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

    console.info('-------------LIMITED ITERATOR-----------------');
    for (let i = 0; i < maxLevel; i++) {
        console.info('-------START ITERATION-----------');
        console.info('SEND ', this.data.map(f => f.name), 'AS INVITED');
        const nextCircle = getNextUniqueCicle(friends, this.data);
        console.info(nextCircle);
        this.data = this.data.concat(nextCircle);
        console.info('--------------END ITERATION-----------------');
    }

    this.data = this.data.filter(item => filter.exec(item));
}

LimitedIterator.prototype = Iterator.prototype;

function getNextUniqueCicle(friends, invitations) {
    if (invitations.length === 0) {
        return sortByName(dedupe(filterBest(friends)));
    }

    const friendsOfInvitedFriends = invitations
        .map(fr => fr.friends)
        .reduce((acc, frSet) => acc.concat(frSet), [])
        .map(frName => friends.find(item => item.name === frName));

    console.info('friends of invited', friendsOfInvitedFriends.map(f => f.name));

    const uniqueFriends = dedupe(friendsOfInvitedFriends);

    console.info('unique', uniqueFriends.map(f => f.name));
    console.info('overall', invitations.map(f => f.name));

    const notInvited = uniqueFriends.filter(friend => invitations.indexOf(friend) === -1);

    console.info('not invited', notInvited.map(f => f.name));

    return sortByName(notInvited);
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
