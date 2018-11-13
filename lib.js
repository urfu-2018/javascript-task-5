'use strict';

/**
 * Возвращает список друзей, удовлятворяющих условиям фильтра
 * @param {Object[]} friends - список всех друзей
 * @param {Filter} filter - фильтр
 * @param {Number} levels - максимальный круг друзей
 * @returns {Object[]}
 */
function getFriends(friends, filter, levels = Number.MAX_SAFE_INTEGER) {
    if (levels === 0) {
        return [];
    }
    // друзья на 1 круге (лучшие друзья)
    let levelFriends = friends.filter(friend => friend.best);
    // приглашенные лучшие друзья
    let invited = levelFriends
        .filter(friend => filter.isAcceptableFriend(friend))
        .sort(friendsNamesCompare);
    while (levels > 1) {
        // имена друзей на втором круге (друзья лучших друзей; на 3 круге и т.д. аналогично)
        const NEXT_LEVEL_NAMES = getNextLevelNames(levelFriends);
        // список друзей на втором круге в виде массива объектов (на 3 круге и т.д. аналогично)
        levelFriends = getLevelFriends(friends, NEXT_LEVEL_NAMES, invited);
        // список приглашенных друзей на втором круге (на 3 круге и т.д. аналогично)
        const NEXT_LEVEL_INVITED = levelFriends.filter(friend => {
            return filter.isAcceptableFriend(friend);
        }).sort(friendsNamesCompare);
        // если на втором круге нет приглашенных - выходим из цикла (на 3 круге и т.д. аналогично)
        if (!NEXT_LEVEL_INVITED.length) {
            break;
        }
        // добавляем к списку всех приглашенных (на 3 круге и т.д. аналогично)
        invited = invited.concat(NEXT_LEVEL_INVITED);
        levels--;
    }

    return invited;
}

/**
 * Comparator для сортировки друзей
 * @param {Object} firstFriend
 * @param {Object} secondFriend
 * @returns {Number}
 */
function friendsNamesCompare(firstFriend, secondFriend) {
    return firstFriend.name.localeCompare(secondFriend.name);
}

/**
 * Возвращает массив имен друзей для следующего круга
 * @param {Object[]} levelFriends - список друзей на текущем круге (только на одном круге)
 * @returns {String[]}
 */
function getNextLevelNames(levelFriends) {
    return levelFriends.reduce((names, friend) => {
        friend.friends.forEach(name => {
            if (!names.includes(name)) {
                names.push(name);
            }
        });

        return names;
    }, []);
}

/**
 * Возвращает список друзей на следующем круге на основе списка имен друзей следующего
 * круга (друзья друзей) и списка уже приглашенных
 * @param {Object[]} friends - список всех друзей
 * @param {String[]} names - список имен друзей на следующем круге (друзья друзей)
 * @param {Object[]} invited - список уже приглашенных друзей
 * @returns {Object[]}
 */
function getLevelFriends(friends, names, invited) {
    return friends.filter(friend => {
        return names.includes(friend.name) && !invited.some(invitedFriend => {
            return invitedFriend.name === friend.name;
        });
    });
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('specified filter is not an instance of Filter');
    }
    this.friendIndex = 0;
    this.friends = getFriends(friends, filter);
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
    this.super(friends, filter);
    maxLevel = typeof maxLevel === 'number' && maxLevel > 0 ? maxLevel : 0;
    this.friends = getFriends(friends, filter, maxLevel);
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isAcceptableFriend = (friend) => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isAcceptableFriend = (friend) => friend.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isAcceptableFriend = (friend) => friend.gender === 'female';
}

/**
 * Проверяет, закончена ли работа итератора
 * @returns {boolean}
 */
Iterator.prototype.done = function () {
    return this.friendIndex >= this.friends.length;
};

/**
 * Возвращает следующий элемент итерации
 * @returns {Object|null}
 */
Iterator.prototype.next = function () {
    if (this.done()) {
        return null;
    }

    return this.friends[this.friendIndex++];
};

/**
 * Фильтрам в прототип записываем прототип базового фильтра
 */
MaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Итератору с ограничением в прототип записываем прототип базового итератора
 */
LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.super = Iterator;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
