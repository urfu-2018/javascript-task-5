'use strict';

const nameSort = function (first, second) {
    return first.name.localeCompare(second.name);
};

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
    this.guests = getInvitedFriends(friends, filter);
    this.done = () => {
        return this.guests.length === 0;
    };
    this.next = () => {
        return this.guests.shift();
    };
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
    if (maxLevel === 0) {
        return [];
    }
    this.guests = getInvitedFriends(friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.getNeed = function (array, gender) {
        return array.filter(element => {
            return element.gender === gender;
        });
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Filter.call(this);
    this.gender = 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Filter.call(this);
    this.gender = 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);

function getNextCircle(currentCircle, friends, invitedFriends) {
    console.info(currentCircle);
    let combinedFriends = currentCircle.reduce((array, friend) => {
        return array.concat(friend.friends);
    }, []);
    let objectFriends = getFriends(combinedFriends, friends);

    return objectFriends.filter(friend => !invitedFriends.includes(friend));
}

function getInvitedFriends(friends, filter, maxLevel = Infinity) {
    let invitedFriends = [];
    let currentCircle = friends.filter(friend => friend.best).sort(nameSort);
    while (maxLevel > 0 && currentCircle.length !== 0) {
        invitedFriends = invitedFriends.concat(currentCircle);
        console.info(invitedFriends);
        currentCircle = getNextCircle(currentCircle, friends, invitedFriends).sort(nameSort);
        maxLevel--;
    }

    return filter.getNeed(invitedFriends, filter.gender);
}

function getFriends(combinedFriends, friends) {
    let result = [];
    combinedFriends.forEach(friend => {
        friends.forEach(element => {
            if (element.name === friend) {
                result.push(element);
            }
        });
    });

    return result;
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
