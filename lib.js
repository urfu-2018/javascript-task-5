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
 * @param {Object[]} collection
 *  @param {Filter} filter
 */
function Iterator(collection, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
    this.index = 0;
    this.collection = collection.filter(filter.predicate);

    this.next = function () {
        return this.done() ? null : this.collection[this.index++];
    };

    this.done = function () {
        return !(this.index < this.collection.length);
    };
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
    Iterator.call(this, getFriendsByCircles(friends, maxLevel), filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.predicate = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.predicate = friend => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.predicate = friend => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = LimitedIterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
