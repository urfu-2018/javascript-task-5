'use strict';

function isInstanceFilter(filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('Объект Filter.prototype не присутствует в ' +
        'цепочке прототипов filter');
    }
}

function sortByName(arrObjects) {
    return arrObjects.sort(function (a, b) {
        if (a.info.name > b.info.name) {
            return 1;
        }
        if (a.info.name < b.info.name) {
            return -1;
        }

        return 0;
    });
}

function levelDetermination(levelFriends, friends, invited) {
    let newLevelFriends = [];
    levelFriends.forEach(parent => {
        newLevelFriends = newLevelFriends.concat(parent.info.friends);
    });
    newLevelFriends.forEach((child, indexChild) => {
        newLevelFriends.forEach((element, index) => {
            if (indexChild !== index && element === child) {
                newLevelFriends.splice(index, 1);
            }
        });
    });
    newLevelFriends = newLevelFriends.filter(child =>
        !invited.some(friend => friend.info.name === child))
        .map(child => {
            return {
                info: friends.find(friend => friend.name ===
                child),
                level: levelFriends[1].level + 1
            };
        });

    return newLevelFriends;
}

function definitionInvitedFriends(friends) {
    let levelFriends = friends.filter(friend => friend.best);
    levelFriends.forEach((parent, indexParent) => {
        levelFriends.forEach((element, index) => {
            if (indexParent !== index && element.name === parent.name) {
                levelFriends.splice(index, 1);
            }
        });
    });
    levelFriends = levelFriends.map(parent => {
        return {
            info: parent,
            level: 1
        };
    });
    let invited = [];
    while (levelFriends[0]) {
        invited = invited.concat(sortByName(levelFriends));
        levelFriends = levelDetermination(levelFriends, friends, invited);
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
        return this.done() ? null : this.friends[this.nextIndex++].info;
    },
    define(friends, filter, maxLevel) {
        isInstanceFilter(filter);
        friends = definitionInvitedFriends(friends);
        if (maxLevel < 1) {
            friends = [];
        }
        if (maxLevel) {
            friends = friends.filter(friend => friend.level <= maxLevel);
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
                return friend.info.gender === 'male';
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
                return friend.info.gender === 'female';
            }
        }
    });
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
