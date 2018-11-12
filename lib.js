'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    // console.info(friends, filter);

    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    this.friends = getFriends(friends).filter((arg) => filter.filter(arg));
    this.position = 0;
}

Iterator.prototype.done = function () {
    return this.position >= this.friends.length;
};

Iterator.prototype.next = function () {
    if (this.done()) {
        return null;
    }

    return this.friends[this.position++];
};

function compareFriends(friend1, friend2) {
    return friend1.name.localeCompare(friend2.name);
}

function getBestFriends(friends) {
    return friends.filter(friend => friend.best).sort(compareFriends);
}

function getFriends(friends, maxLevel = Infinity) {
    let invitations = [];
    if (maxLevel < 1) {
        return invitations;
    }

    let previousCircle = getBestFriends(friends);
    if (previousCircle.length === 0) {
        return invitations;
    }

    invitations = invitations.concat(previousCircle);
    for (let i = 1; i < maxLevel; i++) {
        previousCircle = getNextCircle(previousCircle, invitations, friends);

        if (!previousCircle.length) {
            break;
        }
        invitations = invitations.concat(previousCircle);
    }

    return invitations;
}

function getNextCircle(previousCircle, addedFriends, friends) {
    const candidateNames = [].concat(...previousCircle.map(friend => friend.friends));
    const candidates = candidateNames.map(name => friends.find(friend => name === friend.name));
    const alreadyInvited = friend => !addedFriends.includes(friend);
    const nextCircle = removeDuplicates(candidates.filter(alreadyInvited));

    return nextCircle.sort(compareFriends);
}

function removeDuplicates(arr) {
    return Array.from(new Set(arr));
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
    // console.info(friends, filter, maxLevel);

    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    Object.setPrototypeOf(this, Iterator.prototype);
    this.friends = getFriends(friends, maxLevel).filter((arg) => filter.filter(arg));

    this.position = 0;
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    // console.info('Filter');
    this.gender = '';
}

Filter.prototype.filter = function (friend) {
    if (this.gender === '' || friend.gender === this.gender) {
        return true;
    }

    return false;
};

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    // console.info('MaleFilter');
    Object.setPrototypeOf(this, Filter.prototype);
    this.gender = 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    // console.info('FemaleFilter');
    Object.setPrototypeOf(this, Filter.prototype);
    this.gender = 'female';
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
