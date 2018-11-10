'use strict';

function generateIterator(iterable) {
    let current = 0;
    let last = iterable.length;

    return {
        next() {
            if (current < last) {
                return iterable[current++];
            }
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
    return generateIterator(getLeveledFriends(friends).filter(filter));
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
    return generateIterator(getLeveledFriends(friends, maxLevel).filter(filter));
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    return () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    return obj => obj.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    return obj => obj.gender === 'female';
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
