'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {int} maxLevel
 */
function Iterator(friends, filter, maxLevel = Infinity) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
    this.filteredFriends = getFriends(friends, filter, maxLevel);
    this.pointer = 0;
    this.done = function () {
        return this.pointer + 1 > this.filteredFriends.length;
    };
    this.next = function () {
        return this.done() ? null : this.filteredFriends[this.pointer++];
    };
}


function getFriends(friends, filter, maxLevel) {
    let filteredFriends = [];
    let level = 0;
    let currentLevelFriends = friends.filter(friend => friend.best).sort(sortByName);

    while (currentLevelFriends.length !== 0 && level < maxLevel) {
        let newFilterFriends = [];
        filteredFriends = filteredFriends.concat(currentLevelFriends);

        newFilterFriends = currentLevelFriends
            .reduce(function (prev, curr) {
                return [...prev, ...curr.friends];
            }, [])
            .sort()
            .map(name => friends.find(f => f.name === name));

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
    Iterator.call(this, friends, filter, maxLevel);
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
