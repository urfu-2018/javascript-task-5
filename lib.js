'use strict';


function sortByName(firstPerson, secondPerson) {

    return firstPerson.name.localeCompare(secondPerson.name);
}

function getFriendsOfFriends(friend, otherFriends) {
    const friendsOfFriends = [];
    for (const nameFriend of friend.friends) {
        const newGuest = findFriend(nameFriend, otherFriends);
        friendsOfFriends.push(newGuest);
    }

    return friendsOfFriends;
}

function findFriend(nameFriend, otherFriends) {
    for (let i = 0; i < otherFriends.length; i++) {
        if (otherFriends[i].name === nameFriend) {
            const finedFriend = otherFriends[i];
            otherFriends.splice(i, 1);

            return finedFriend;
        }
    }
}

function checkLevel(maxLevel) {
    return typeof maxLevel === 'number' && maxLevel > 0 ? maxLevel : 0;
}

function getInvitedFriends(friends, filter, maxLevel = Infinity) {
    let currentRound = filter.sortBestFriends(friends);
    let otherFriends = filter.sortCommonFriends(friends);
    let countCicle = 1;
    let nextRound = [];
    maxLevel = checkLevel(maxLevel);
    let invitedFriends = filter.filterGender(currentRound);
    while (countCicle < maxLevel && otherFriends.length && invitedFriends.length) {
        for (const currentFriend of currentRound) {
            nextRound = nextRound
                .concat(getFriendsOfFriends(currentFriend, otherFriends))
                .sort(sortByName);
        }
        currentRound = nextRound.filter(elArr => Boolean(elArr));
        nextRound = [];
        invitedFriends = invitedFriends.concat(filter.filterGender(currentRound));
        countCicle++;
    }

    return invitedFriends;
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
    this.sortCommonFriends = (arrFriends) => arrFriends
        .filter(friend => !friend.best)
        .sort(sortByName);

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
