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
    this.filterFriends = getFriends(friends, filter);
    this.pointer = 0;
    this.done = function () {
        return this.pointer + 1 > this.filterFriends.length;
    };
    this.next = function () {
        return this.done() ? null : this.filterFriends[this.pointer++];
    };
}


function getFriends(friends, filter, maxLevel = Infinity) {
    let filteredFriends = [];
    let level = 0;
    let currentLevelFriends = friends.filter(friend => friend.best).sort(sortByName);

    while (currentLevelFriends.length !== 0 && level < maxLevel) {
        let newFilterFriends = [];
        filteredFriends = filteredFriends.concat(currentLevelFriends);

        newFilterFriends = currentLevelFriends
            .map((friend) => friend.friends)
            .reduce((a, b) => a.concat(b))
            .sort()
            .map((name) => friends.filter(f => f.name === name))
            .reduce((a, b) => a.concat(b));

        currentLevelFriends = getUniqueFriends(newFilterFriends, filteredFriends);
        level++;
    }

    return filteredFriends.filter(friend => filter.isPermissible(friend));
}

function getUniqueFriends(newFilterFriends, filteredFriends) {
    let currentFriends = [];
    for (let friend of newFilterFriends) {
        if (currentFriends.includes(friend) || filteredFriends.includes(friend)) {
            continue;
        }
        currentFriends.push(friend);
    }

    return currentFriends;
}

function sortByName(a, b) {
    if (a.name === b.name) {
        return 0;
    }

    return a.name < b.name ? -1 : 1;
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
    this.filterFriends = getFriends(friends, filter, maxLevel);
    console.info(this.filterFriends);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isPermissible = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isPermissible = (person) => person.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isPermissible = (person) => person.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
