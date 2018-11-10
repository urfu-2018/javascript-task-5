'use strict';

function compareByName(first, second) {
    return first.name.localeCompare(second.name);
}

function getFriendByName(friends, name) {
    const friend = friends.filter(f => f.name === name);

    return friend[0];
}

function getFriends(Arcadyfriends, filter, maxLevel = Infinity) {
    let currentLevel = 1;
    let currentLevelFriends = Arcadyfriends.filter(friend => friend.best).sort(compareByName);

    const friends = [];

    while (currentLevelFriends.length > 0 && currentLevel <= maxLevel) {
        friends.push(...currentLevelFriends);
        currentLevelFriends = currentLevelFriends
            .reduce((prev, curr) => [...prev, ...curr.friends], [])
            .map(friendName => getFriendByName(Arcadyfriends, friendName))
            .filter((item, pos, self) => !friends.includes(item) && self.indexOf(item) === pos)
            .sort(compareByName);
        currentLevel++;
    }

    return friends.filter(filter.isRelevant);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('filter is not instance of Filter');
    }
    this.guests = getFriends(friends, filter);
}

Iterator.prototype = {
    guests: [],
    currentIndex: 0,
    done() {
        return this.currentIndex >= this.guests.length;
    },
    next() {
        return this.done() ? null : this.guests[this.currentIndex++];
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
    this.guests = getFriends(friends, filter, maxLevel);
    this.currentIndex = 0;
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isRelevant = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isRelevant = friend => friend.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isRelevant = friend => friend.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
