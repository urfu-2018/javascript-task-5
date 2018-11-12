'use strict';

const alphabet = (x, y) => x.name.localeCompare(y.name);

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
//    console.info(friends, filter);
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
    this.friends = friends;
    this.index = 0;
    this.sortedFriends = this.sortFriends(this._maxLevel)
        .filter(filter.filterFriends);
}

Iterator.prototype = {
    constructor: Iterator,
    next() {
        if (this.index < this.sortedFriends.length) {

            return this.sortedFriends[this.index++];
        }

        return null;
    },
    done() {
        return this.index === this.sortedFriends.length;
    },

    sortFriends(maxLevel = Infinity) {
        let sortedFriends = [];
        let currentFriends = this.friends
            .filter(friend => friend.best)
            .sort(alphabet);
        let currentLevel = 0;
        while (currentLevel < maxLevel && currentFriends.length !== 0) {
            currentFriends.forEach(friend => sortedFriends.push(friend));
            currentFriends = this.getNextLevel(currentFriends, sortedFriends);
            currentLevel += 1;
        }

        return sortedFriends;
    },

    getNextLevel(currentFriends, sortedFriends) {
        let nextLevel = [];
        currentFriends.forEach(friend => {
            friend.friends.forEach(name => {
                if (!this.hasThisFriend(name, sortedFriends)) {
                    nextLevel.push(this.friends.find(y => y.name === name));
                }
            });
        });

        return nextLevel.sort(alphabet);
    },

    hasThisFriend(name, friendsGroup) {
        return friendsGroup.map(x => x.name)
            .includes(name);
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
    //  console.info(friends, filter, maxLevel);
    this._maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

const getAllFriends = () => true;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    // console.info('Filter');
    this.filterFriends = getAllFriends;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    // console.info('MaleFilter');
    this.filterFriends = friend => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    // console.info('FemaleFilter');
    this.filterFriends = friend => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
