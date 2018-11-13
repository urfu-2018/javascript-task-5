'use strict';

function getGuests(friends, maxLevel) {
    let temporaryListOfFriends = friends
        .filter(friend => friend.best)
        .sort((person1, person2) => person1.name > person2.name);
    const guests = maxLevel > 0 ? [...temporaryListOfFriends] : [];

    while (--maxLevel > 0 && temporaryListOfFriends.length > 0) {
        temporaryListOfFriends = getNotInvitedFriends(
            temporaryListOfFriends.map(friend => friend.friends),
            guests
        )
            .sort((personName1, personName2) => personName1 > personName2)
            .map(friendName => friends.find(person => person.name === friendName));

        guests.push(...temporaryListOfFriends);
    }

    return guests;
}

function getNotInvitedFriends(currentLevelFriends, guests) {
    const result = [];
    for (const listOfFriends of currentLevelFriends) {
        result.push(...listOfFriends);
    }

    return [...new Set(result.filter(friendName =>
        guests.every(friend => friendName !== friend.name)))];
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('Filter does not have type "Filter"');
    }

    this.guests = getGuests(friends, Infinity).filter(filter.fitsTheCondition);

    this.next = function () {
        return this.done() ? null : this.guests.shift();
    };

    this.done = function () {
        return this.guests.length === 0;
    };
}

/**
 * Итератор по друзьям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    Iterator.call(this, friends, filter);
    this.guests = getGuests(friends, maxLevel).filter(filter.fitsTheCondition);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.fitsTheCondition = function () {
        return true;
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.fitsTheCondition = function (person) {
        return person.gender === 'male';
    };
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.fitsTheCondition = function (person) {
        return person.gender === 'female';
    };
}

FemaleFilter.prototype = Object.create(Filter.prototype);


exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
