'use strict';


function sortByName(firstPerson, secondPerson) {

    return firstPerson.name.localeCompare(secondPerson.name);
}

function getNextRound(friends, currentRound, invitedFriends) {
    return currentRound
        .reduce((arrNames, currentFriend) => arrNames.concat(currentFriend.friends), [])
        .map(friendName => friends.find(friend => friend.name === friendName))
        .filter((friend, i, arrFriends) =>
            arrFriends.indexOf(friend) === i &&
            !invitedFriends.includes(friend))
        .sort(sortByName);
}

function getInvitedFriends(friends, filter, maxLevel = Infinity) {
    let currentRound = friends.filter(friend => friend.best).sort(sortByName);
    let countCicle = 1;
    let invitedFriends = [];
    while (countCicle <= maxLevel && currentRound.length > 0 && maxLevel > 0) {
        invitedFriends = invitedFriends.concat(currentRound);
        currentRound = getNextRound(friends, currentRound, invitedFriends);
        countCicle++;
    }

    return invitedFriends.filter(filter.filterGender);
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
    this.next = () => {
        if (!this.done()) {
            return this.invitedFriends[this.count++];
        }

        return null;
    };

    this.done = () => {
        return !(this.count < this.invitedFriends.length);
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
    this.invitedFriends = getInvitedFriends(friends, filter, maxLevel);
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
