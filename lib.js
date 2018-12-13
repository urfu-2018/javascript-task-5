'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    this.current = 0;
    this.friends = filterAndOrder(friends, filter);
}

Object.assign(Iterator.prototype, {
    done() {
        return this.friends.length === this.current;
    },
    next() {
        return this.done()
            ? null
            : this.friends[this.current++];
    }
});

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    const correctedLevel = typeof maxLevel === 'number' && maxLevel > 0 ? maxLevel : 0;
    this.current = 0;
    this.friends = filterAndOrder(friends, filter, correctedLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = 'all';
}

Object.assign(Filter.prototype, {
    apply(friend) {
        return friend.gender === this.gender ||
            this.gender === 'all';
    }
});

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.gender = 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.gender = 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);

function nameCompare(a, b) {
    return a.name.localeCompare(b.name);
}

function flat(accumulator, currentValue) {
    return accumulator.concat(currentValue);
}

function filterAndOrder(friends, filter, maxLevel = Infinity) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    let invitedFriends = [];
    invitedFriends.push([]);
    const sortedFriends = friends
        .sort(nameCompare)
        .map(friend => {
            return {
                friend: friend,
                level: Infinity,
                visited: false
            };
        });

    let level = 1;
    while (level <= maxLevel) {
        const notVisitedFriends = sortedFriends
            .filter(friend => !friend.visited);
        const currentLevelFriends =
            getCurrentLevelFriends(level, notVisitedFriends, invitedFriends[level - 1]);
        if (currentLevelFriends.length === 0) {
            break;
        }
        invitedFriends.push(currentLevelFriends);
        level++;
    }

    return invitedFriends
        .reduce(flat, [])
        .filter(friend => filter.apply(friend));
}

function getCurrentLevelFriends(level, notVisitedFriends, previousLevelVisitedFriends) {
    const friends = [];
    notVisitedFriends.forEach(friend => {
        if (level === 1) {
            if (friend.friend.best) {
                visitFriend(friend, friends, level);
            }
        } else {
            const isThisLevelFriend = previousLevelVisitedFriends
                .map(previousLevelFriend => previousLevelFriend.friends)
                .reduce(flat, [])
                .includes(friend.friend.name);
            if (isThisLevelFriend) {
                visitFriend(friend, friends, level);
            }
        }
    });

    return friends;
}

function visitFriend(friend, friends, level) {
    friend.visited = true;
    friend.level = level;
    friends.push(friend.friend);
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
