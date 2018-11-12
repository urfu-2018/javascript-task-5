'use strict';

function getFriendsByCircles(friends, depth = Infinity) {
    const friendsMap = new Map();
    friends.forEach(friend => friendsMap.set(friend.name, friend));

    let circle = friends.filter(f => f.best)
        .map(f => f.name)
        .sort((a, b) => a.localeCompare(b));

    let guests = [];
    for (let i = 0; i < depth; i++) {
        guests = guests.concat(circle);
        circle = getNextCircle(circle, guests, friendsMap);
        if (circle.length === 0) {
            break;
        }
    }

    return guests.map(g => friendsMap.get(g));
}

function getNextCircle(currentCircle, guests, friendsMap) {
    guests = new Set(guests);
    const nextCircle = new Set();
    for (let friend of currentCircle) {
        friendsMap.get(friend).friends.forEach(name => {
            if (!guests.has(name)) {
                nextCircle.add(name);
            }
        });
    }

    return [...nextCircle].sort((a, b) => a.localeCompare(b));
}

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

    this.guests = getFriendsByCircles(friends, this.maxLevel)
        .filter(filter.predicate);
    this.index = 0;
}

Iterator.prototype = {
    constructor: Iterator,
    next: function () {
        return this.done() ? null : this.guests[this.index++];
    },

    done: function () {
        return !(this.index < this.guests.length);
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
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.predicate = () => true;
}

const filter = new Filter();

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Filter.call(this);
    this.predicate = friend => friend.gender === 'male';
    this.predicate.bind(this);
}

MaleFilter.prototype = filter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Filter.call(this);
    this.predicate = friend => friend.gender === 'female';
    this.predicate.bind(this);
}

FemaleFilter.prototype = filter;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
