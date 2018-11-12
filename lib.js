/* eslint-disable linebreak-style */
'use strict';

/**
 * Получаем всех новых друзей без повторений
 * @param {Object[]} friends - Список друзей
 * @returns {Array}
 */
function getAllFriends(friends) {
    return friends.reduce((allFriends, friend) =>
        allFriends.concat(friend.friends.filter(name =>
            !allFriends.includes(name))), []);
}

/**
 * Фильтруем всех друзей, получаем коненчый список гостей
 * @param {Object[]} friends
 * @param {Filter} filter - гендерный фильтр
 * @param {Number} maxLevel - ограничения по кругу
 * @returns {Array}
 */
function getFriends(friends, filter, maxLevel = Infinity) {
    let guestFilter = [];
    let summonMate = friends.filter(friend => friend.best);
    let notSummon = friend => !guestFilter.includes(friend);
    while (maxLevel > 0 && summonMate.length > 0) {
        guestFilter = guestFilter.concat(summonMate);
        // Сохраняем друзей только лучших друзей, друзей друзей и тд
        summonMate = getAllFriends(summonMate)
            .map(name => friends.find(friend => friend.name === name))
            .filter(notSummon)
            .sort((a, b) => a.name > b.name);
        maxLevel--;
    }

    return guestFilter.filter((male) => filter.position(male));
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
    this.friends = getFriends(friends, filter);
    this.count = 0;
    this.done = () => this.friends.length === this.count;
    this.next = () => this.done() ? null : this.friends[this.count++];
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
    if (!(maxLevel > 0)) {
        this.done = () => true;
    }
    Iterator.call(this, friends, filter);
    this.friends = getFriends(friends, filter, maxLevel);
}
LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.position = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.position = friend => friend.gender === 'male';

}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.position = friend => friend.gender === 'female';

}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
