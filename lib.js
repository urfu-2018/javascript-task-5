'use strict';

function isInstanceFilter(filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
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
    levelFriends.forEach(bestFriend => {
        bestFriend.info.friends.forEach((friendOfBestFriend) => {
            if (invited.find(friend => friend.info.name ===
            friendOfBestFriend)) {
                return;
            }
            const info = friends.find(friend => friend.name ===
            friendOfBestFriend);
            if (info) {
                newLevelFriends.push({
                    info,
                    level: bestFriend.level + 1
                });
            }
        });
    });

    return newLevelFriends;
}

function definitionInvitedFriends(friends) {
    let levelFriends = friends.reduce((bestFriends, friend) => {
        if (friend.best === true &&
        (bestFriends.find(bestFriend => bestFriend.info.name ===
        friend.name) === undefined)) {
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
    isInstanceFilter(filter);
    let invited = definitionInvitedFriends(friends);
    invited = filter.splitBySex(invited);
    this.nextIndex = 0;
    this.invited = invited;
}

Iterator.prototype = {
    done() {
        return this.nextIndex >= this.invited.length;
    },
    next() {
        return this.done() ? null : this.invited[this.nextIndex++].info;
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
    isInstanceFilter(filter);
    let invited = definitionInvitedFriends(friends);
    invited = invited.filter(friend => friend.level <= maxLevel);
    invited = filter.splitBySex(invited);
    this.nextIndex = 0;
    this.invited = invited;
    Object.setPrototypeOf(this, Iterator.prototype);
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');
}

Filter.prototype.splitBySex = function (friends) {
    return friends.filter(friend => this.checkFilter(friend));
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
            value(friend) {
                return friend.info.gender === 'male';
            },
            enumerable: true
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
            value(friend) {
                return friend.info.gender === 'female';
            },
            enumerable: true
        }
    });
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
