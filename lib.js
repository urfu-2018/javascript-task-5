'use strict';

function assignCirclesFromBestFriend(bestFriend, friends) {
    const queue = [bestFriend];

    while (queue.length) {
        let friend = queue.shift();
        let friendsOfFriend = friends.filter(
            f => friend.friends.includes(f.name) && !(f.circle <= friend.circle)
        );
        queue.push(...friendsOfFriend);
        friendsOfFriend.forEach(f => (f.circle = friend.circle + 1));
    }
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('filter should extend Filter constructor');
    }
    for (const bestFriend of friends.filter(f => f.best)) {
        bestFriend.circle = 1;
        assignCirclesFromBestFriend(bestFriend, friends);
    }
    this.friends = friends
        .sort((x, y) => (x.circle + x.name).localeCompare(y.circle + y.name))
        .filter(filter.rule);
    this.next = () => (this.done() ? null : this.friends.shift());
    this.done = () => !this.friends.length;
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
    Iterator.call(this, friends, filter);
    this.done = () => !this.friends.length || this.friends[0].circle > maxLevel;
}
Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.rule = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.rule = friend => friend.gender === 'male';
}
Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.rule = friend => friend.gender === 'female';
}
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
