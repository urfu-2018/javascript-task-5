'use strict';

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
    this.friends = getCircles(friends, filter, this.maxLevel);
    let currentFriendIndex = 0;
    this.done = () => currentFriendIndex >= this.friends.length;
    this.next = () => this.done() ? null : this.friends[currentFriendIndex++];
}

function getCircles(friends, filter, maxLevel = Infinity) {
    const circles = [];
    const namesComparator = (a, b) => a.name.localeCompare(b.name);
    let currentCircle = friends.filter(friend => friend.best).sort(namesComparator);
    while (currentCircle.length > 0 && maxLevel > 0) {
        circles.push(...currentCircle);
        const nextCircle = new Set();
        currentCircle.forEach(friend =>
            friend.friends.forEach(name => {
                const friendWithName = friends.find(person => person.name === name);
                if (!circles.includes(friendWithName)) {
                    nextCircle.add(friendWithName);
                }
            }));
        currentCircle = [...nextCircle].sort(namesComparator);
        maxLevel--;
    }

    return circles.filter(filter.check);
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
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.check = (person) => !this.gender || person.gender === this.gender;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Filter.call(this);
    this.gender = 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Filter.call(this);
    this.gender = 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
