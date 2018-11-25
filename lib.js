'use strict';

function isInstanceFilter(filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
}

function sortByName(object) {
    return object.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }

        return 0;
    });
}

function levelDetermination(levelFriends, friends) {
    const newLevelFriends = [];
    levelFriends.forEach(bestFriend => {
        bestFriend.friends.forEach((friendOfBestFriend) => {
            friends.forEach(friend => {
                if (friend.name === friendOfBestFriend && !friend.level) {
                    friend.level = bestFriend.level + 1;
                    newLevelFriends.push(friend);
                }
            });
        });
    });

    return newLevelFriends;
}

function sorting(friends) {
    friends = sortByName(friends);
    friends.forEach((friend) => {
        if (friend.best === true) {
            friend.level = 1;
        }
    });
    let levelFriends = friends.filter(friend => friend.level);
    if (!levelFriends[0]) {
        friends = [];
    }
    while (levelFriends[0]) {
        levelFriends = levelDetermination(levelFriends, friends);
    }

    return friends.sort((a, b) => a.level - b.level);
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
    friends = sorting(friends);
    friends = filter.splitBySex(friends);
    this.nextIndex = 0;
    this.friends = friends;
}

Iterator.prototype = {
    done() {
        return this.nextIndex >= this.friends.length;
    },
    next() {
        return this.done() ? null : this.friends[this.nextIndex++].name;
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
    friends = sorting(friends);
    friends = filter.splitBySex(friends);
    friends = friends.filter(friend => friend.level <= maxLevel);
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
    return friends.filter(friend => friend.gender === this.gender);
};

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');

    return Object.create(Filter.prototype, {
        gender: {
            value: 'male',
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
        gender: {
            value: 'female',
            enumerable: true
        }
    });
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
