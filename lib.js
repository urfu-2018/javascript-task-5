'use strict';

function getNextRound(friends, currentRound, invitedFriends) {
    return currentRound
        .reduce((arrNames, currentFriend) => arrNames.concat(currentFriend.friends), [])
        .map(friendName => friends.find(friend => friend.name === friendName))
        .filter((friend, i, arrFriends) =>
            arrFriends.indexOf(friend) === i &&
            !invitedFriends.includes(friend));
}

function sortByName(firstPerson, secondPerson) {

    return firstPerson.name.localeCompare(secondPerson.name);
}

function plusNumber(maxLevel) {
    return typeof maxLevel === 'number' && maxLevel > 0 ? maxLevel : 0;
}

function getFirstRound(currentRound, filter, maxLevel) {
    if (maxLevel && currentRound.length) {

        return filter.filterGender(currentRound);
    }

    return [];
}

function getInvitedFriends(friends, filter, maxLevel = Infinity) {
    let currentRound = filter.sortBestFriends(friends);
    let countCicle = 1;
    maxLevel = plusNumber(maxLevel);
    let invitedFriends = getFirstRound(currentRound, filter, maxLevel);
    while (countCicle < maxLevel && currentRound.length) {
        currentRound = getNextRound(friends, currentRound, invitedFriends);
        invitedFriends = invitedFriends.concat(currentRound);
        countCicle++;
    }

    return filter.filterGender(invitedFriends);
}


function next(context) {
    if (context.count < context.invitedFriends.length) {
        context.count++;

        return context.invitedFriends[context.count - 1];
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
    this.next = next.bind(this, this);
    this.done = done.bind(this, this);
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
    this.sortBestFriends = (arrFriends) => arrFriends
        .filter(friend => friend.best)
        .sort(sortByName);
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
MaleFilter.prototype = new Filter();

function MaleFilter() {
    this.filterGender = (arrFriends) =>
        arrFriends.filter(friend => friend.gender === 'male');
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
FemaleFilter.prototype = new Filter();

function FemaleFilter() {
    this.filterGender = (arrFriends) =>
        arrFriends.filter(friend => friend.gender === 'female');
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
