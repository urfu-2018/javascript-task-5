'use strict';

function nameSort(fr1, fr2) {
    return fr1.name.localeCompare(fr2.name);
}

function sortAndFilterFriends(friends, filter, level = Infinity) {
    let bestFriends = friends.filter(a => a.best).sort(nameSort);
    let friendsForInvite = [];
    let newCircle = bestFriends;

    function checkOnRepeat(friend, index, arr) {
        return !friendsForInvite.find(person => person.name === friend.name) &&
            arr.findIndex(person => person.name === friend.name) === index;
    }

    while (level > 0 && newCircle.length > 0) {
        friendsForInvite = friendsForInvite.concat(newCircle);

        newCircle = newCircle
            .reduce((list, friend) => list.concat(friend.friends), [])
            .map(name => friends.find(friend => friend.name === name))
            .filter(checkOnRepeat)
            .sort(nameSort);

        level--;
    }

    return friendsForInvite.filter(filter.genderFilter);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!Filter.prototype.isPrototypeOf(filter)) {
        throw new TypeError();
    }

    this.filteredFriends = sortAndFilterFriends(friends, filter);
    this.index = 0;
}

Iterator.prototype.next = function () {
    return this.done() ? null : this.filteredFriends[this.index++];
};

Iterator.prototype.done = function () {
    return this.index >= this.filteredFriends.length;
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
    Iterator.call(this, friends, filter);
    this.filteredFriends = sortAndFilterFriends(friends, filter, maxLevel);
}
LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.genderFilter = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.genderFilter = (friend) => friend.gender === 'male';
}
MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.genderFilter = (friend) => friend.gender === 'female';
}
FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
