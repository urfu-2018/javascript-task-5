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
    this.guests = getInvitedGuests(friends).filter(filter.checkGender);
}

Iterator.prototype.next = function () {
    return this.done() ? null : this.guests.shift();
};

Iterator.prototype.done = function () {
    return this.guests.length === 0;
};

function includeGuest(guests) {
    return friend => !guests.includes(friend);
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
        .sort((fr1, fr2) => fr1.name.localeCompare(fr2.name));
    while (curLevel.length > 0 && maxLevel > 0) {
        guests = guests.concat(curLevel);
        curLevel = curLevel
            .map(fr => fr.friends)
            .reduce((a, b) => a.concat(b))
            .map(name => friends.find(fr => fr.name === name))
            .filter(includeGuest(guests))
            .sort((fr1, fr2) => fr1.name.localeCompare(fr2.name));
        maxLevel--;
    }

    return guests;
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
    this.guests = getInvitedGuests(friends, maxLevel).filter(filter.checkGender);
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
