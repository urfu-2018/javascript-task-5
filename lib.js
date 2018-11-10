'use strict';

function generateIterator(iterable) {
    let current = 0;
    let last = iterable.length;

    return {
        next() {
            if (current < last) {
                return iterable[current++];
            }

            return null;
        },

        done() {
            return current === last;
        }
    };
}

function getLeveledFriends(allFriends, maxLevel = Infinity) {
    const friendsMap = createNameToFriendMap(allFriends);
    let result = [];
    let currentLevel = 0;
    let currentLevelFriends = allFriends
        .filter(friend => friend.best)
        .sort((a, b) => a.name > b.name);
    while (currentLevel < maxLevel && currentLevelFriends.length !== 0) {
        result.push(...currentLevelFriends);
        currentLevel++;
        currentLevelFriends = currentLevelFriends
            .filter(friend => friend.hasOwnProperty('friends'))
            .reduce((accumulator, currentFriend) => [...accumulator, ...currentFriend.friends], [])
            .map(friendName => friendsMap.get(friendName))
            .filter(friendOfFriend => !result.includes(friendOfFriend))
            .sort((a, b) => a.name > b.name);
    }

    return result;
}

function createNameToFriendMap(friends) {
    let result = new Map();
    friends.forEach(friend => {
        result.set(friend.name, friend);
    });

    return result;
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

    return generateIterator(getLeveledFriends(friends).filter(filter.isFit));
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
        throw new TypeError();
    }

    return generateIterator(getLeveledFriends(friends, maxLevel).filter(filter.isFit));
}

LimitedIterator.prototype = Object.create(Iterator.prototype, {
    constructor: {
        value: LimitedIterator
    }
});

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isFit = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isFit = obj => obj.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype, {
    constructor: {
        value: MaleFilter
    }
});

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isFit = obj => obj.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype, {
    constructor: {
        value: FemaleFilter
    }
});

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
