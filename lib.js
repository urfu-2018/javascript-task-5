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
    return a.name < b.name ? -1 : 1;
}

function internal(currentLevel, sortedFriends, result, i) {

    const currentFriend = sortedFriends[i].friend;
    if (currentLevel === 1) {
        if (currentFriend.best) {
            return takeVisited(currentLevel, sortedFriends, result, i);
        }
    } else {
        const q = result
            .filter(r => r.level === currentLevel - 1)
            .map(r => r.friend.friends);
        const isFriend = q.reduce(flat, [])
            .includes(currentFriend.name);
        if (isFriend) {
            return takeVisited(currentLevel, sortedFriends, result, i);
        }
    }

    return 0;
}

function flat(accumulator, currentValue) {
    return accumulator.concat(currentValue);
}

function takeVisited(currentLevel, sortedFriends, result, i) {
    const el = sortedFriends.splice(i, 1)[0];
    el.level = currentLevel;
    result.push(el);

    return -1;
}

function filterAndOrder(friends, filter, maxLevel = Infinity) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    let result = [];
    const sortedFriends = friends
        .sort(nameCompare)
        .map(friend => {
            return {
                friend: friend,
                level: Infinity
            };
        });

    let currentLevel = 1;
    while (currentLevel <= maxLevel) {
        let iterationResult = result.slice();
        for (let i = 0; i < sortedFriends.length; i++) {
            i = i + internal(currentLevel, sortedFriends, iterationResult, i);
        }
        if (iterationResult.length === result.length) {
            break;
        }
        result = iterationResult;
        currentLevel++;
    }

    return result
        .map(f => f.friend)
        .filter(f => filter.apply(f));
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
