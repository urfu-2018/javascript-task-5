'use strict';

const alphabeticalCompare = (a, b) => a.name.localeCompare(b.name);

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    console.info(friends, filter);
    if (!Filter.prototype.isPrototypeOf(filter)) { // аналог !(filter instanceof Filter)
        throw new TypeError('`filter` parameter must be a prototype of Filter!');
    }
    this._pointer = 0;
    this._guests = this._getGuestList(friends, filter, this._maxLevel);
}

Iterator.prototype = {
    constructor: Iterator,

    _getGuestList(friends, filter, maxLevel = Infinity) {
        let circle = friends.filter(friend => friend.best).sort(alphabeticalCompare);
        let guestList = [];
        let level = 0;
        while (level < maxLevel && circle.length > 0) {
            guestList.push(...circle);
            circle = this._getNextCircle(circle, guestList, friends);
            level += 1;
        }

        return guestList.filter(filter.condition);
    },

    _getNextCircle(circle, guestList, friends) {
        const newCircle = circle
            .reduce((result, person) => [...result, ...person.friends], [])
            .map(name => this._getFriend(name, friends))
            .filter(friend => !guestList.includes(friend));

        return [...new Set(newCircle)].sort(alphabeticalCompare);
    },

    _getFriend(friendName, friends) {
        return friends.find(friend => friend.name === friendName);
    },

    next() {
        if (this._pointer < this._guests.length) {
            return this._guests[this._pointer++];
        }

        return null;
    },

    done() {
        return this._pointer === this._guests.length;
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
    console.info(friends, filter, maxLevel);
    this._maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

// Так реализуется наследование в JS, и оно называется "Prototype inheritance"
LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;


/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');
    this.condition = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');
    Filter.call(this); // чисто для формальности
    this.condition = friend => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');
    Filter.call(this); // чисто для формальности
    this.condition = friend => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;


exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
