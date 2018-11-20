'use strict';


/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Int} maxLevel
 */
function Iterator(friends, filter, maxLevel = friends.length + 1) {
    this.currentIndex = 0;
    this.listOfGuests = [];
    this.next = function () {
        return this.done() ? null : this.listOfGuests[this.currentIndex++];
    };
    this.done = function () {
        return this.currentIndex >= this.listOfGuests.length;
    };
    if (filter instanceof Filter) {
        this.listOfGuests = chooseFriends(friends, maxLevel)
            .filter(friend => filter.isAppropriate(friend));
        this.currentIndex = 0;
    } else {
        throw new TypeError();
    }
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

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
function chooseFriends(friends, maxLevel = friends.length + 1) {
    var selection = [];
    var currentLevel = 1;
    var currentLevelFriends = friends.filter(friend => friend.best);

    while (currentLevelFriends.length > 0 && currentLevel <= maxLevel) {
        selection.push(...currentLevelFriends.slice().sort(nameComparator));
        currentLevelFriends = currentLevelFriends
            .reduce((acc, friend) => acc.concat(friend.friends), [])
            .map(name => friends.find(friend => friend.name === name))
            .filter(function (friend, index, arr) {
                return !selection.includes(friend) && arr.indexOf(friend) === index;
            });
        currentLevel++;
    }

    return selection;
}

function nameComparator(firstFriend, secondFriend) {
    return firstFriend.name.localeCompare(secondFriend.name);
}

Filter.prototype = {
    isAppropriate: function () {
        return true;
    }
};

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    return this;
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isAppropriate = function (a) {
        return a.gender === 'male';
    };

    return this;
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isAppropriate = function (a) {
        return a.gender === 'female';
    };

    return this;
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
