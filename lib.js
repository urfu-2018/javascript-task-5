'use strict';

function getFriendsQueue(friends, filter, maxLevel = Infinity) {
    const friendsLevels = {};
    const tempDic = {};
    friends.forEach(x => {
        tempDic[x.name] = x;
    });
    const queue = friends.filter(person => person.best === true);
    queue
        .forEach(person => {
            friendsLevels[person.name] = 1;
        });

    for (let i = 0; i < friends.length && i < queue.length; i++) {
        const person = queue[i];
        person.friends
            .filter(friendName => !friendsLevels.hasOwnProperty(friendName))
            .forEach(friendName => {
                friendsLevels[friendName] = friendsLevels[person.name] + 1;
                queue.push(tempDic[friendName]);
            });
    }

    return queue
        .filter(person => filter.filter(person) && friendsLevels[person.name] <= maxLevel)
        .sort(
            (first, second) => friendsLevels[first.name] - friendsLevels[second.name] ||
                first.name.localeCompare(second.name));
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
    this.queue = getFriendsQueue(friends, filter);
}

Iterator.prototype = {
    next() {
        return this.done() ? null : this.queue.shift();
    },
    done() {
        return this.queue.length === 0;
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
    this.queue = getFriendsQueue(friends, filter, maxLevel);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filter = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filter = x => x.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filter = x => x.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
