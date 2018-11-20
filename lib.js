'use strict';

function nameSort(fr1, fr2) {
    return fr1.name.localeCompare(fr2.name);
}

function sortAndFilterFriends(friends, filter) {
    let friendsCircles = getFriendsCircles(friends);

    return friendsCircles.filter(filter.genderFilter);
}

function getFriendsCircles(friends, level = Infinity) {
    let bestFriends = friends.filter(a => a.best).sort(nameSort);
    let friendsForInvite = [];
    let newCircle = bestFriends;
    let friendsCounter = 0;

    function checkOnRepeat(friend, index, arr) {
        return !friendsForInvite.includes(friend) && arr.indexOf(friend) === index;
    }

    while (level > 0 && newCircle.length > 0 && friendsCounter < friends.length) {
        friendsForInvite = friendsForInvite.concat(newCircle);
        friendsCounter += newCircle.length;
        newCircle = newCircle
            .reduce((list, friend) => list.concat(friend.friends), [])
            .map(name => friends.find(friend => friend.name === name))
            .filter(checkOnRepeat)
            .sort(nameSort);

        level--;
    }

    return friendsForInvite;
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
    let rightLevelFriends = getFriendsCircles(friends, maxLevel);
    Iterator.call(this, rightLevelFriends, filter);
}
LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    // empty constructor
}

Filter.prototype.genderFilter = function () {
    return true;
};

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    // empty constructor
}
MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;
MaleFilter.prototype.genderFilter = function (friend) {
    return friend.gender === 'male';
};

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    // empty constructor
}
FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;
FemaleFilter.prototype.genderFilter = function (friend) {
    return friend.gender === 'female';
};

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
