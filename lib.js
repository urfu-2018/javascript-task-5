'use strict';

function isInstanceFilter(filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('Объект Filter.prototype не присутствует в ' +
        'цепочке прототипов filter');
    }
}

function sortByName(arrObjects) {
    return arrObjects.sort((a, b) => a.name.localeCompare(b.name));
}

function levelDetermination(level, friends, invited) {
    let newLevelFriends = [];
    invited.get(level).forEach(parent => {
        newLevelFriends = newLevelFriends.concat(parent.friends);
    });
    newLevelFriends.forEach((child, indexChild) => {
        newLevelFriends.forEach((element, index) => {
            if (indexChild !== index && element === child) {
                newLevelFriends.splice(index, 1);
            }
        });
    });
    let invitedArr = [];
    for (let levelArr of invited.values()) {
        invitedArr = invitedArr.concat(levelArr);
    }
    newLevelFriends = newLevelFriends.filter(child =>
        !invitedArr.some(friend => friend.name === child))
        .map(child => friends.find(friend => friend.name === child));

    return newLevelFriends;
}

function definitionInvitedFriends(friends, maxLevel) {
    let levelFriends = friends.filter(friend => friend.best);
    levelFriends.forEach((parent, indexParent) => {
        levelFriends.forEach((element, index) => {
            if (indexParent !== index && element.name === parent.name) {
                levelFriends.splice(index, 1);
            }
        });
    });
    let level = 1;
    let invited = new Map();
    while (levelFriends[0] && level <= maxLevel && maxLevel > 0) {
        invited.set(level, sortByName(levelFriends));
        levelFriends = levelDetermination(level, friends, invited);
        level++;
    }

    return invited;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    console.info(friends, filter);
    this.define(friends, filter);
}

Iterator.prototype = {
    done() {
        return this.nextIndex >= this.friends.length;
    },
    next() {
        return this.done() ? null : this.friends[this.nextIndex++];
    },
    define(friends, filter, maxLevel) {
        isInstanceFilter(filter);
        if (maxLevel === undefined) {
            maxLevel = Infinity;
        }
        const invited = definitionInvitedFriends(friends, maxLevel);
        friends = [];
        for (let levelFriends of invited) {
            friends = friends.concat(levelFriends[1]);
        }
        friends = friends.filter(friend => filter.checkFilter(friend));
        this.nextIndex = 0;
        this.friends = friends;
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
    console.info(friends, filter, maxLevel);
    Object.setPrototypeOf(this, Iterator.prototype);
    this.define(friends, filter, maxLevel);
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');
}

Filter.prototype.checkFilter = function () {
    return true;
};

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');

    return Object.create(Filter.prototype, {
        checkFilter: {
            value: function (friend) {
                return friend.gender === 'male';
            }
        }
    });
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');

    return Object.create(Filter.prototype, {
        checkFilter: {
            value: function (friend) {
                return friend.gender === 'female';
            }
        }
    });
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
