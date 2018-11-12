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

    this.collection = prepareFriendsList(friends, filter);
}

Iterator.prototype.done = function () {
    return this.collection.length === 0;
};

Iterator.prototype.next = function () {
    return this.done() ? null : this.collection.shift();
};

/**
 * Итератор по друзьям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    Iterator.call(this, friends, filter);
    this.collection = prepareFriendsList(friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.getAppropriateItem = () => true;
}


/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.getAppropriateItem = (person) => person.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.getAppropriateItem = (person) => person.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

function prepareFriendsList(friends, filter, maxLevel = friends.length) {
    let invitedFriends = friends
        .filter(friend => friend.best === true)
        .sort(alphabetSort);

    let nextLevelFriends = getNextLevelFriends(invitedFriends, invitedFriends, friends);
    let level = 1;

    while (nextLevelFriends.length !== 0 && level < maxLevel) {
        invitedFriends = invitedFriends.concat(nextLevelFriends);
        nextLevelFriends = getNextLevelFriends(nextLevelFriends, invitedFriends, friends);
        ++level;
    }

    return invitedFriends.filter(friend => filter.getAppropriateItem(friend));
}

function getNextLevelFriends(currentFriends, invitedFriends, phonebook) {
    let nextLevelFriends = [];
    currentFriends.forEach(friend => {
        friend.friends.forEach(nextLevelFriend => {
            if (!nextLevelFriends.includes(nextLevelFriend)) {
                nextLevelFriends.push(nextLevelFriend);
            }
        });
    });

    return nextLevelFriends
        .filter(friend => invitedFriends.every(invitedFriend => invitedFriend.name !== friend))
        .map(friend => phonebook.find(friendInPhonebook => friendInPhonebook.name === friend))
        .sort(alphabetSort);
}

function alphabetSort(first, secont) {
    return first.name.localeCompare(secont.name);
}
exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
