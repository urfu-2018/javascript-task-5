'use strict';

const sortByName = function (a, b) {
    return a.name.localeCompare(b.name);
};

function preparingListOfFriendsForIteration(friends, filter, maxLevel = Infinity) {
    const listOfFriends = [];

    let friendsAtLevel = friends.filter(friend => friend.best).sort(sortByName);

    while (friendsAtLevel.length > 0 && maxLevel > 0) {
        listOfFriends.push(...friendsAtLevel);
        friendsAtLevel = friendsAtLevel
            .reduce((friendsOfFriends, friend) => {
                const arrayFriend = [];

                for (let i in friend.friends) {
                    if (!friend.friends.hasOwnProperty(i)) {
                        continue;
                    }

                    if (!friendsOfFriends.includes(friend.friends[i])) {
                        arrayFriend.push(friend.friends[i]);
                    }
                }

                return friendsOfFriends.concat(arrayFriend);
            }, [])
            .map(nameFriend => {
                return friends.find(friend => friend.name === nameFriend);
            })
            .filter(friend => !listOfFriends.includes(friend))
            .sort(sortByName);

        maxLevel--;
    }

    return listOfFriends.filter(filter.checkFriend);
}

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

    this.friends = preparingListOfFriendsForIteration(friends, filter);
    this.index = -1;
}

Iterator.prototype.next = function () {
    if (this.done()) {
        return null;
    }

    this.index++;

    return this.friends[this.index];
};

Iterator.prototype.done = function () {
    if (this.index === this.friends.length - 1) {
        return true;
    }

    return false;
};

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
        throw new TypeError();
    }

    this.friends = preparingListOfFriendsForIteration(friends, filter, maxLevel);
    this.index = -1;
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.checkFriend = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.checkFriend = friend => friend.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.checkFriend = friend => friend.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
