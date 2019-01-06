'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (filter instanceof Filter) {
        throw new TypeError('Объект фильтра не является инстансом функции-конструктора Filter');
    }

    this.guests = [];
    this.currentGuest = 0;
}

Iterator.prototype.done = function() {
    return this.currentGuest === this.guests.length;
}

Iterator.prototype.next = function() {
    return this.done() ? null : guests[currentGuest++];
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
    console.info(friends, filter, maxLevel);
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {}

Filter.prototype.checkFriend = friend => true;

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;
MaleFilter.prototype.checkFriend = friend => friend.gender === 'male';

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;
FemaleFilter.prototype.checkFriend = friend => friend.gender === 'female';

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
