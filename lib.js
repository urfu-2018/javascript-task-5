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
        return this.done() ? null : this.guests.shift();
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
    this.guests = getInvitedFriends(friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');
}

Filter.prototype.check = () => true;

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');
}

MaleFilter.prototype = Object.create(Filter.prototype, {
    check: {
        value: friend => friend.gender === 'male'
    }
});

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');
}

FemaleFilter.prototype = Object.create(Filter.prototype, {
    check: {
        value: friend => friend.gender === 'female'
    }
});

function getNextCircle(currentCircle, friends, invitedFriends) {
    console.info(currentCircle);

    return currentCircle.reduce((array, friend) => array.concat(friend.friends), [])
        .map(guest => friends.find(friend => friend.name === guest))
        .filter((friend, index, array) => !invitedFriends.includes(friend) &&
            array.indexOf(friend) === index);
}

function getInvitedFriends(friends, filter, maxLevel = Infinity) {
    let invitedFriends = [];
    let currentCircle = friends.filter(friend => friend.best).sort(nameSort);
    while (maxLevel > 0 && currentCircle.length > 0) {
        invitedFriends = invitedFriends.concat(currentCircle);
        currentCircle = getNextCircle(currentCircle, friends, invitedFriends).sort(nameSort);
        maxLevel--;
    }

    return invitedFriends.filter(filter.check);
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
