'use strict';

let bestFriends = [];
let countInvitePerLap = Infinity;

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
    this.guests = addNewLapGuests(friends, filter);
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
    this.guests = addNewLapGuests(friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = undefined;
    this.getNeed = function (array, gender) {
        if (!gender) {
            return array;
        }

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

function getFriends(friends, allFriends, uniqueFriends) {
    friends.forEach(friend => {
        allFriends.forEach(element => {
            if (element.name === friend) {
                uniqueFriends.push(element);
            }
        });
    });

    return uniqueFriends;
}

function notInvited(friend, invitedMales) {
    return invitedMales.every(male => {
        return friend.name !== male.name;
    });
}

function getBestFriends(friends) {
    return friends.filter(element => {
        return element.best;
    });
}

function getNextCircle(circle, friends) {
    let uniqueFriends = [];
    circle.forEach(bestFriend => {
        uniqueFriends = getFriends(bestFriend.friends, friends, uniqueFriends);
    });

    return uniqueFriends;
}

function addNewLapGuests(friends, filter, maxLevel = Infinity) {
    bestFriends = getBestFriends(friends);
    let oneGenderBestFriends = filter.getNeed(bestFriends, filter.gender);
    let invitedFriends = pushUsed(oneGenderBestFriends);
    maxLevel--;
    let regularFriends = bestFriends;
    while (maxLevel !== 0 && countInvitePerLap !== 0) {
        countInvitePerLap = 0;
        regularFriends = getNextCircle(regularFriends, friends);
        let oneGenderFriends = filter.prototype.getNeed(regularFriends, filter.gender);
        invitedFriends = pushUsed(oneGenderFriends, invitedFriends);
        maxLevel--;
    }

    return invitedFriends;
}

function nameSort(array) {
    return array.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        }

        return 0;
    });
}

function pushUsed(maleFriends, invitedFriends = []) {
    nameSort(maleFriends);
    maleFriends.forEach(friend => {
        if (notInvited(friend, invitedFriends)) {
            countInvitePerLap++;
            invitedFriends.push(friend);
        }
    });

    return invitedFriends;
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
