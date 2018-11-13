'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel
 */
function Iterator(friends, filter, maxLevel = Infinity) {
    var invitedFriends = friends
        .filter(friend => friend.best)
        .map(friend => {
            friend.level = 1;

            return friend;
        });
    var queue = invitedFriends.slice(0);
    var currentFriend;
    var currentFriends = friends;

    function addFriend(friendName) {
        if (!invitedFriends.filter(invitedFriend => invitedFriend.name === friendName).length) {
            const newFriend = currentFriends
                .filter(OneOfAllfriend => OneOfAllfriend.name === friendName)[0];

            newFriend.level = currentFriend.level + 1;
            queue.push(newFriend);
            invitedFriends.push(newFriend);
        }
    }

    while (queue.length > 0 && maxLevel > queue[0].level) {
        currentFriend = queue.shift();
        currentFriend.friends.map(addFriend);
    }

    var sortedInvitedFriends = [];
    for (let level = 1; level <= invitedFriends[invitedFriends.length - 1].level; level++) {
        sortedInvitedFriends.push(
            ...invitedFriends
                .filter(friend => friend.level === level)
                .filter(filter)
                .sort((firstFriend, secondFriend) => firstFriend.name
                    .localeCompare(secondFriend.name)));
    }

    this.done = () => {
        return sortedInvitedFriends.length === 0;
    };
    this.next = () => {
        return sortedInvitedFriends.shift();
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
    Iterator.call(this, friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    return (friend) => friend.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    return (friend) => friend.gender === 'female';
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
