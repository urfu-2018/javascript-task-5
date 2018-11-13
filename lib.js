'use strict';


const byNames = (friend1, friend2) => friend1.name.localeCompare(friend2.name);

function getSortedFriends(friends, maxLevel = Infinity) {
    let sortedFriends = [];
    let currentFriends = friends.filter(friend => friend.best).sort(byNames);
    let currentLevel = 0;
    while (currentLevel < maxLevel && currentFriends.length !== 0) {
        sortedFriends.push(...currentFriends);
        let nextFriendLevel = [];
        currentFriends.forEach(friend => nextFriendLevel.push(...friend.friends));
        nextFriendLevel = nextFriendLevel
            .map(name => friends.find(friend => friend.name === name))
            .filter(friend => !sortedFriends.includes(friend));
        currentFriends = [...new Set(nextFriendLevel)].sort(byNames);
        currentLevel++;
    }

    return sortedFriends;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    console.info(friends, filter);
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
    this.friends = friends;
    this.currentIndex = 0;
    this.sortedFriends = getSortedFriends(this.friends, this.maxLevel)
        .filter(filter.filterFriends);
}

Iterator.prototype = {
    next() {
        return this.done() ? null : this.sortedFriends[this.currentIndex++];
    },
    done() {
        return this.currentIndex === this.sortedFriends.length;
    }
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
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
    console.info(friends, filter, maxLevel);
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');
    this.filterFriends = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');
    this.filterFriends = friend => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');
    this.filterFriends = friend => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
