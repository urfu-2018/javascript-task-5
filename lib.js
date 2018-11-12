'use strict';

/**
 * Формирует очередной уровень друзей по предыдущему
 * @param {Object[]} friendsToInvite
 * @param {Object[]} allFriends
 * @returns {Object[]}
 */
function getNextLevelOfFriends(friendsToInvite, allFriends) {
    return friendsToInvite.map(prevLevelFriend =>
        allFriends.filter(friend => friend.friends.includes(prevLevelFriend.name)))
        .reduce((flat, part) => flat.concat(part), []);
}

function sortAndUniq(array) {
    array.sort((a, b) => a.name.localeCompare(b.name));

    return Array.from(new Set(array));
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
    const toInvite = [friends.filter(friend => friend.best)];
    toInvite[0] = sortAndUniq(toInvite[0]);
    for (let i = 0; i < maxLevel - 1; i++) {
        friends = friends.filter(friend => !toInvite[i].includes(friend)); // убрать добавленных
        toInvite[i + 1] = getNextLevelOfFriends(toInvite[i], friends); // добавить уровень
        toInvite[i + 1] = sortAndUniq(toInvite[i + 1]);
        if (friends.length === 0 || toInvite[i + 1].length === 0) {
            break; // если всех добавили, или все оставшиеся не связаны.
        }
    }
    this.friendsToInvite =
        filter.doFiltering(toInvite.reduce((flat, part) => flat.concat(part), []));
}

Iterator.prototype.done = function () {
    return this.friendsToInvite.length === 0;
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
Filter.prototype.doFiltering = function (friends) {
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
