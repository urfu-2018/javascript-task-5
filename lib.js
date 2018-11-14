'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('Invalid type of filter!');
    }
    this.guests = inviteGuestsByGender(friends, filter);
}

Iterator.prototype.next = function () {
    return this.done() ? null : this.guests.shift();
};

Iterator.prototype.done = function () {
    return this.guests.length === 0;
};

/**
 * @param {Array} guests
 * @returns {function(*=): boolean}
 */
function includeGuest(guests) {
    return friend => !guests.includes(friend);
}

/**
 * @param {Object} fr1
 * @param {Object} fr2
 * @returns {number}
 */
function compareNames(fr1, fr2) {
    return fr1.name.localeCompare(fr2.name);
}

/**
 * @param {Array} friends - friend {Object}
 * @param {Number} maxLevel
 * @returns {Array}
 */
function getInvitedGuests(friends, maxLevel = Infinity) {
    let guests = [];
    let curLevel = friends
        .filter(friend => friend.best)
        .sort(compareNames);
    while (curLevel.length > 0 && maxLevel > 0) {
        guests = guests.concat(curLevel);
        curLevel = curLevel
            .map(fr => fr.friends)
            .reduce((a, b) => a.concat(b))
            .map(name => friends.find(fr => fr.name === name))
            .filter(includeGuest(guests));
        curLevel = Array.from(new Set(curLevel))
            .sort(compareNames);
        maxLevel--;
    }

    return guests;
}

/**
 * @param {Array} friends - friend {Object}
 * @param {Filter} filter
 * @param {Number} maxLevel
 * @returns {Array}
 */
function inviteGuestsByGender(friends, filter, maxLevel = Infinity) {
    const guests = getInvitedGuests(friends, maxLevel);

    return guests.filter(friend => filter.checkGender(friend));
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
    this.guests = inviteGuestsByGender(friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.checkGender = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.checkGender = friend => friend.gender === 'male';
}

MaleFilter.prototype = new Filter();

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.checkGender = friend => friend.gender === 'female';
}

FemaleFilter.prototype = new Filter();

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
