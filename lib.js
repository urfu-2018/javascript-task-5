'use strict';

/**
 * Получить всех приглашенных друзей
 * @param {Object[]} friends
 * @param {Number} maxLevel
 * @returns {Object[]}
 */
function getGuests(friends, maxLevel = Infinity) {
    const guests = [];
    let temporaryListOfFriends = sortByName(friends.filter(friend => friend.best));

    while (maxLevel-- > 0 && temporaryListOfFriends.length > 0) {
        guests.push(...temporaryListOfFriends);

        temporaryListOfFriends = getUninvitedFriends(
            temporaryListOfFriends.map(friend => friend.friends),
            new Set(guests.map(guest => guest.name))
        ).map(friendName => friends.find(person => person.name === friendName));
        temporaryListOfFriends = sortByName(temporaryListOfFriends);
    }

    return guests;
}

/**
 * Получить ещё не приглашенных друзей
 * @param {Object[]} currentLevelFriends
 * @param {Object[]} guests
 * @returns {Object[]}
 */
function getUninvitedFriends(currentLevelFriends, guests) {
    const result = new Set();
    currentLevelFriends.map(friends => addUniqueFriends(result, friends));

    return [...result].filter(friendName => !guests.has(friendName));
}

/**
 * Добавляет уникальных друзей
 * @param {Set<Object>} uniqueFriends
 * @param {Object[]} friends
 */
function addUniqueFriends(uniqueFriends, friends) {
    friends.map(friend => uniqueFriends.add(friend));
}

/**
 * Сортирует список друзей по имени
 * @param {Object[]} friends
 * @returns {Object[]}
 */
function sortByName(friends) {
    return friends.sort((friend1, friend2) => friend1.name.localeCompare(friend2.name));
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

    this.guests = getGuests(friends).filter(filter.fitsTheCondition);
}

Iterator.prototype = {
    done() {
        return this.guests.length === 0;
    },
    next() {
        return this.done() ? null : this.guests.shift();
    }
};

/**
 * Итератор по друзьям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    this.guests = getGuests(friends, maxLevel).filter(filter.fitsTheCondition);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.fitsTheCondition = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.fitsTheCondition = person => person.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.fitsTheCondition = person => person.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);


exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
