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
    const newLevelFriends = [];
    levelFriends.forEach(parent => {
        parent.info.friends.forEach((child) => {
            if (invited.concat(newLevelFriends)
                .some(friend => friend.info.name === child)) {
                return;
            }
            newLevelFriends.push({
                info: friends.find(friend => friend.name ===
                    child),
                level: parent.level + 1
            });
        });
    });

    return newLevelFriends;
}

function definitionInvitedFriends(friends) {
    let levelFriends = friends.reduce((bestFriends, friend) => {
        if (friend.best === true &&
        !bestFriends.some(bestFriend => bestFriend.info.name ===
        friend.name)) {
            bestFriends.push({
                info: friend,
                level: 1
            });
        }

        return bestFriends;
    }, []);
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
    this.nextIndex = 0;
    this.friends = friends;
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
        if (maxLevel) {
            friends = friends.filter(friend => friend.level <= maxLevel);
        }
        friends = friends.filter(friend => filter.checkFilter(friend));
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
    this.nextIndex = 0;
    this.friends = friends;
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
