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

    this.friends = this.addFriendsOfFriends(friends, this.maxLevel)
        .filter(filter.isValid);
}

Iterator.prototype = {
    constructor: Iterator,
    addFriendsOfFriends(friends, maxLevel = Infinity) {
        let currentFriends = friends
            .filter(friend => friend.best)
            .sort((first, second) => first.name.localeCompare(second.name));
        const friendsOfFriends = [];

        while (currentFriends.length > 0 && maxLevel > 0) {
            friendsOfFriends.push(...currentFriends);

            const subFriendList = currentFriends
                .map(friend => friend.friends)
                .reduce((acc, friendList) => acc.concat(friendList));

            currentFriends = friends.filter(friend => !friendsOfFriends.includes(friend) &&
                subFriendList.includes(friend.name))
                .sort((first, second) => first.name.localeCompare(second.name));

            maxLevel -= 1;
        }

        return friendsOfFriends;
    },
    done() {
        return this.friends.length === 0;
    },
    next() {
        return this.friends.shift();
    }
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
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');
}

Filter.prototype.isValid = () => true;

/**
 * Фильтр друзей-парней
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');
}

MaleFilter.prototype = Object.create(Filter.prototype, {
    constructor: {
        value: MaleFilter
    },
    isValid: {
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
    constructor: {
        value: FemaleFilter
    },
    isValid: {
        value: friend => friend.gender === 'female'
    }
});

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
