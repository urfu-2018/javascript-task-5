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
    this.friends = getCircles(friends, filter, Infinity);
    this.currentPosition = 0;
}

Iterator.prototype.done = function () {
    return this.currentPosition === this.friends.length;
};

Iterator.prototype.next = function () {
    if (!this.done()) {
        this.currentPosition += 1;

        return this.friends[this.currentPosition - 1];
    }

    return null;
};

function sortByNames(friend1, friend2) {
    return friend1.name.localeCompare(friend2.name);
}

function pushFriend(nextLevel, friend) {
    if (!friend) {
        return nextLevel;
    }
    if (nextLevel.findIndex(person => person.name === friend.name) !== -1) {
        return nextLevel;
    }
    nextLevel.push(friend);

    return nextLevel;
}

function getNextLevel(friends, friendsOnCurrentLevel, invitedFriends) {
    let nextLevel = [];
    for (let currentFriend of friendsOnCurrentLevel) {
        for (let friendName of currentFriend.friends) {
            nextLevel = pushFriend(nextLevel, friends.find(friend => friend.name === friendName));
        }
    }
    nextLevel = nextLevel.filter(friend =>
        !invitedFriends.find(friend_ => friend.name === friend_.name));

    return nextLevel;
}

function getInvitedFriends(maxLevel, friends, invitedFriends) {
    let level = 1;
    let friendsOnCurrentLevel = invitedFriends;
    while (level < maxLevel && friendsOnCurrentLevel.length !== 0) {
        let nextLevelFriends = getNextLevel(friends, friendsOnCurrentLevel, invitedFriends);
        nextLevelFriends = nextLevelFriends.sort(sortByNames);
        level++;
        invitedFriends = invitedFriends.concat(nextLevelFriends);
        friendsOnCurrentLevel = nextLevelFriends;
    }

    return invitedFriends;
}

function getCircles(friends, filter, maxLevel) {
    if (!friends || !maxLevel || maxLevel < 1) {
        return [];
    }
    let bestFriends = friends.filter(friend => friend.best).sort(sortByNames);
    if (bestFriends.length === friends.length) {
        return filter.genderFilter(bestFriends);
    }
    const invitedFriends = getInvitedFriends(maxLevel, friends, bestFriends);

    return filter.genderFilter(invitedFriends);
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
    this.friends = getCircles(friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = '';
}

Filter.prototype.genderFilter = function (friends) {
    return friends.filter(function (friend) {
        return friend.gender === this.gender || this.gender === '';
    }, this);
};

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.gender = 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.gender = 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
