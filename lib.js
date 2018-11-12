'use strict';

/**
 * Создает массив друзей, разделенных на уровни близости, из графа
 * @param {Object[]} friends
 * @param {Number} maxLevel
 * @returns {[Object[]]}
 */
function getFriendsForInviting(friends, maxLevel) {
    const toInvite = [friends.filter(friend => friend.best)];
    for (let i = 0; i < maxLevel - 1; i++) {
        friends = friends.filter(friend => !toInvite[i].includes(friend)); // убрать добавленных
        toInvite[i + 1] = getNextLevelOfFriends(toInvite[i], friends); // добавить уровень
        if (friends.length === 0 || toInvite[i].length === 0) {
            break; // если всех добавили, или все оставшиеся не связаны.
        }
    }

    return toInvite;
}

/**
 * Формирует очередной уровень друзей по предыдущему
 * @param {Object[]} friendsToInvite
 * @param {Object[]} allFriends
 * @returns {Object[]}
 */
function getNextLevelOfFriends(friendsToInvite, allFriends) {
    const nextLevel = [];
    friendsToInvite.map(prevLevelFriend =>
        allFriends.filter(friend => friend.friends.includes(prevLevelFriend.name))
            .map(friend => nextLevel.push(friend)));
    nextLevel.sort((a, b) => a.name.localeCompare(b.name));

    return nextLevel;
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
    if (friends === undefined) {
        this.friendsToInvite = [];
    } else {
        this.friendsToInvite = filter.doFiltering(getFriendsForInviting(friends, maxLevel)
            .reduce((flat, part) => flat.concat(part)), []);
    }

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
    this.gender = /./;
}
Filter.prototype.doFiltering = function (friends) {
    return friends.filter(friend => friend.gender.match(this.gender));
};

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.gender = /^male/;
}
MaleFilter.prototype = Object.create(Filter.prototype);


/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.gender = /^female/;
}
FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
