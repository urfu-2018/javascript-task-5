'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    // console.info(friends, filter);
    this.sortedFriends = setFriends(friends);
    console.info(this.sortedFriends);
    this.filterFriends = [];
    this.sortedFriends.forEach(person => {
        if (filter.isPermissible(person.friend)) {
            this.filterFriends.push(person);
        }
    });
    this.pointer = 0;
    this.done = () => {
        return this.pointer + 1 > this.filterFriends.length;
    };

    this.next = () => {
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
        // console.info(person);
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
    // console.info(dictionaryFriends);
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

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isPermissible = () => {
        return true;
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Filter.call(this);
    this.isPermissible = (person) => {
        return person.gender === 'male';
    };
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Filter.call(this);
    this.isPermissible = (person) => {
        return person.gender === 'female';
    };
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
