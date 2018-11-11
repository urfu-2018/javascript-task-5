'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    this.sortedFriends = setFriends(friends);
    console.info(this.sortedFriends);
    this.filterFriends = [];
    this.sortedFriends.forEach(person => {
        if (filter.isPermissible(person.friend)) {
            this.filterFriends.push(person);
        }
    });
    this.pointer = 0;
    this.done = function () {
        return this.pointer + 1 > this.filterFriends.length;
    };

    this.next = function () {
        this.pointer++;

        return this.filterFriends[this.pointer - 1].friend;
    };
}

function getDictionaryFriends(friends) {
    let dict = new Map();
    friends.forEach(friend => {
        dict.set(friend.name, friend);
    });

    return dict;
}

function getBestFriendsName(friends) {
    let best = [];
    friends.forEach(friend => {
        if (friend.best) {
            best.push(friend.name);
        }
    });

    return best;
}

function sortedFriendsHas(sortedFriends, name) {
    for (let person of sortedFriends) {
        if (person.friend.name === name) {
            return true;
        }
    }

    return false;
}

function processCurrentLevelNames(currentLevelNames, dictionaryFriends, sortedFriends, level) {
    let nextLevelNames = [];
    for (let name of currentLevelNames) {
        if (dictionaryFriends.has(name) && !sortedFriendsHas(sortedFriends, name)) {
            sortedFriends.push({ friend: dictionaryFriends.get(name), level });
            // console.info(dictionaryFriends.get(name));
            nextLevelNames = nextLevelNames.concat(
                getNames(dictionaryFriends.get(name).friends, sortedFriends));
        }
    }

    return { sortedFriends, nextLevelNames };
}


function setFriends(friends) {
    let sortedFriends = [];
    let dictionaryFriends = getDictionaryFriends(friends);
    let level = 0;
    let currentLevelNames = getBestFriendsName(friends);

    while (currentLevelNames.length !== 0) {
        let result = processCurrentLevelNames(
            currentLevelNames, dictionaryFriends, sortedFriends, level);
        level++;
        sortedFriends = result.sortedFriends;
        currentLevelNames = result.nextLevelNames.sort();
    }

    return sortedFriends;
}

function getNames(names, sortedFriends) {
    let nextLevelNames = [];
    for (let friendName of names) {
        if (!nextLevelNames.includes(friendName) &&
        !sortedFriendsHas(sortedFriends, friendName)) {
            nextLevelNames.push(friendName);
        }
    }

    return nextLevelNames;
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
    let newFilterFriends = [];
    for (let person of this.filterFriends) {
        if (person.level < maxLevel) {
            newFilterFriends.push(person);
        }
    }
    this.filterFriends = newFilterFriends;
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
