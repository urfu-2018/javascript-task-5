'use strict';

/**
 * Возвращает отсортированый по .name массив без повторений
 * @param {Object[]} array
 * @returns {Object[]}
 */
function sortAndUniq(array) {
    array.sort((a, b) => a.name.localeCompare(b.name)); // sort - единственная в мире in-place func.

    return Array.from(new Set(array)); // Set не содержит повторений
}

/**
 * Формирует список друзей, отсортированный по уровням и потом алфавиту.
 * @param {Object[]} friends
 * @param {Number} maxLevel
 * @returns {[Object[]]}
 */
function getFriendsToInvite(friends, maxLevel) {
    const toInvite = [sortAndUniq(friends.filter(friend => friend.best))];
    for (let i = 0; i < maxLevel - 1; i++) {
        toInvite[i + 1] = sortAndUniq(getNextLevelOfFriends(toInvite[i], friends));
        if (!friends.length || !toInvite[i + 1].length) {
            break; // если всех добавили, или очередной уровень пуст.
        }
    }

    return Array.from(new Set(toInvite));
}

/**
 * Формирует очередной уровень друзей по предыдущему
 * @param {Object[]} previousLevel
 * @param {Object[]} allFriends
 * @returns {Object[]}
 */
function getNextLevelOfFriends(previousLevel, allFriends) {
    return previousLevel.map(prevLevelFriend => // для каждого из предыдущего уровня
        allFriends.filter(friend => friend.friends.includes(prevLevelFriend.name))) // найти друзей
        .reduce((flat, part) => flat.concat(part), []); // обьеденить все в один массив
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel
 */
function Iterator(friends, filter, maxLevel = Infinity) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('filter should be an instance of Filter');
    }
    if (!friends.length || maxLevel < 1) {
        this.friendsToInvite = [];
    } else {
        this.friendsToInvite = filter.filter(
            getFriendsToInvite(friends, maxLevel).reduce((flat, part) => flat.concat(part), []));
    }
}
Iterator.prototype.done = function () {
    return !this.friendsToInvite.length;
};
Iterator.prototype.next = function () {
    return this.done() ? null : this.friendsToInvite.shift();
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
    Iterator.call(this, friends, filter, maxLevel);
}
LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = '';
}
Filter.prototype.filter = function (friends) {
    return friends.filter(friend => friend.gender === this.gender || this.gender === '');
};

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

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
