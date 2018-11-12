'use strict';

/**
 * Формирует очередной уровень друзей по предыдущему
 * @param {Object[]} previousLevel
 * @param {Object[]} allFriends
 * @returns {Object[]}
 */
function getNextLevelOfFriends(previousLevel, allFriends) {
    return previousLevel.map(prevLevelFriend =>
        allFriends.filter(friend => friend.friends.includes(prevLevelFriend.name)))
        .reduce((flat, part) => flat.concat(part), []);
}

/**
 * Возвращает отсортированый по .name массив без повторений
 * @param {Object[]} array
 * @returns {Object[]}
 */
function sortAndUniq(array) {
    return Array.from(new Set(array.sort((a, b) => a.name.localeCompare(b.name))));
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
    const toInvite = [sortAndUniq(friends.filter(friend => friend.best))];
    for (let i = 0; i < maxLevel - 1; i++) {
        friends = friends.filter(friend => !toInvite[i].includes(friend));
        toInvite[i + 1] = sortAndUniq(getNextLevelOfFriends(toInvite[i], friends));
        if (!friends.length || !toInvite[i + 1].length) {
            break; // если всех добавили, или все оставшиеся не связаны.
        }
    }
    this.previousLevel = filter.filter(toInvite.reduce((flat, part) => flat.concat(part), []));
}
Iterator.prototype.done = function () {
    return !this.previousLevel.length;
};
Iterator.prototype.next = function () {
    return this.done() ? null : this.previousLevel.shift();
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
