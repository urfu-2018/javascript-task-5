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
            if (invited.some(friend => friend.info.name ===
            friendOfBestFriend) ||
            newLevelFriends.some(friend => friend.info.name ===
            friendOfBestFriend)) {
                return;
            }
            newLevelFriends.push({
                info: friends.find(friend => friend.name ===
                    friendOfBestFriend),
                level: bestFriend.level + 1
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
    isInstanceFilter(filter);
    friends = definitionInvitedFriends(friends);
    friends = filter.splitBySex(friends);
    this.nextIndex = 0;
    this.friends = friends;
}

Iterator.prototype = {
    done() {
        return this.nextIndex >= this.friends.length;
    },
    next() {
        return this.done() ? null : this.friends[this.nextIndex++].info;
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
    friends = definitionInvitedFriends(friends);
    friends = friends.filter(friend => friend.level <= maxLevel);
    friends = filter.splitBySex(friends);
    this.nextIndex = 0;
    this.friends = friends;
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
    Object.setPrototypeOf(this, Filter.prototype);
    this.checkFilter = function(friend) {
        return friend.info.gender === 'male';
    }
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');
    Object.setPrototypeOf(this, Filter.prototype);
    this.checkFilter = function(friend) {
        return friend.info.gender === 'female';
    }
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
