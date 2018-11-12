'use strict';

function getNextRound(friends, currentRound, invitedFriends) {
    return currentRound
        .reduce((arrNames, currentFriend) => arrNames.concat(currentFriend.friends), [])
        .map(friendName => friends.find(friend => friend.name === friendName))
        .filter((friend, i, arrFriends) =>
            arrFriends.indexOf(friend) === i &&
            !invitedFriends.includes(friend))
        .sort(sortByName);
}

function sortByName(firstPerson, secondPerson) {

    return firstPerson.name.localeCompare(secondPerson.name);
}

function getInvitedFriends(friends, filter, maxLevel = Infinity) {
    let currentRound = friends.filter(friend => friend.best).sort(sortByName);
    let countCicle = 0;
    let invitedFriends = [];
    while (countCicle < maxLevel && currentRound.length > 0 && maxLevel > 0) {
        invitedFriends = invitedFriends.concat(currentRound);
        currentRound = getNextRound(friends, currentRound, invitedFriends);
        countCicle++;
    }

    return invitedFriends.filter(filter.filterGender);
}


function next(context) {
    if (context.count < context.invitedFriends.length) {

        return context.invitedFriends[context.count++];
    }

    return null;
}

function done(context) {

    return !(context.count < context.invitedFriends.length);
}


/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('Not instance of Filter');
    }
    this.invitedFriends = getInvitedFriends(friends, filter);
    this.count = 0;
    this.next = next.bind(null, this);
    this.done = done.bind(null, this);
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
    if (!(filter instanceof Filter)) {
        throw new TypeError('Not instance of Filter');
    }
    this.invitedFriends = getInvitedFriends(friends, filter, maxLevel);
    this.count = 0;
    this.next = next.bind(this, this);
    this.done = done.bind(this, this);
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filterGender = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

function MaleFilter() {
    this.filterGender = friend => friend.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

function FemaleFilter() {
    this.filterGender = friend => friend.gender === 'female';
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
