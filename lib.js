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
    let invitedFriends = [];
    while (currentRound.length > 0 && maxLevel > 0) {
        invitedFriends = invitedFriends.concat(currentRound);
        currentRound = getNextRound(friends, currentRound, invitedFriends);
        maxLevel--;
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
    this.done = () => {
        return this.invitedFriends.length === 0;
    };

    this.next = () => {
        return this.done() ? null : this.invitedFriends.shift();
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
Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

function MaleFilter() {
    this.filterGender = friend => friend.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

function FemaleFilter() {
    this.filterGender = friend => friend.gender === 'female';
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
