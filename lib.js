'use strict';

function nameSort(fr1, fr2) {
    return fr1.name.localeCompare(fr2.name);
}

function sortAndFilterFriends(friends, filter, level = Infinity) {
    let bestFriends = friends.filter(a => a.best).sort(nameSort);
    let friendsForInvite = [];
    friendsForInvite = friendsForInvite.concat(bestFriends);
    let newCircle = bestFriends;

    function checkOnRepeat(friend) {
        return !friendsForInvite.includes(friend);
    }

    while (level > 1 && newCircle.length > 0) {
        newCircle = newCircle
            .reduce((list, friend) => list.concat(friend.friends), [])
            .map(name => friends.find(friend => friend.name === name))
            .filter(checkOnRepeat)
            .sort(nameSort);

        friendsForInvite = friendsForInvite.concat(newCircle);
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
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    this.filteredFriends = sortAndFilterFriends(friends, filter);
    this.index = 0;
}

Iterator.prototype.next = function () {
    return this.done() ? null : this.filteredFriends[this.index++];
};

Iterator.prototype.done = function () {
    return this.filteredFriends.length <= this.index;
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
