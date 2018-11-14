'use strict';

function getInvitedFriends(friends, filter, maxLevel) {
    const allFriends = friends.reduce(
        (map, friend) => map.set(friend.name, friend),
        new Map());

    let level = 1;
    const invitedFriendNames = new Set();
    let currentLevel = friends.filter(friend => friend.best);

    while (currentLevel.length !== 0 && level <= maxLevel) {
        inviteFriends(currentLevel, invitedFriendNames);
        currentLevel = getNewLevelFriends(currentLevel, invitedFriendNames, allFriends);
        level++;
    }

    return [...invitedFriendNames]
        .map(name => allFriends.get(name))
        .filter(filter.predicate);
}

function inviteFriends(currentLevel, invitedFriendNames) {
    currentLevel
        .sort((f1, f2) => f1.name.localeCompare(f2.name))
        .forEach(friend => invitedFriendNames.add(friend.name));
}

function getNewLevelFriends(currentLevel, invitedFriendNames, allFriends) {
    return [...currentLevel
        .reduce(
            (set, friend) => {
                friend.friends.forEach(name => set.add(name));

                return set;
            },
            new Set())]
        .filter(name => !invitedFriendNames.has(name))
        .map(name => allFriends.get(name));
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number?} maxLevel
 */
function Iterator(friends, filter, maxLevel = Infinity) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    this.invited = getInvitedFriends(friends, filter, maxLevel);
    this.pointer = 0;

    this.next = () => this.done() ? null : this.invited[this.pointer++];

    this.done = () => this.pointer === this.invited.length;
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
    Iterator.call(this, friends, filter, maxLevel);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

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

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.predicate = friend => friend.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
