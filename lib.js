'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('фильтр не Фильтр');
    }

    this.friends = friends;
    this.filter = filter;
    this.result = this.formatFriends(this.maxLevel);
}

Iterator.prototype = {
    formatFriends(maxLevel = this.friends.length) {
        if (maxLevel < 0 || this.friends.length < 0) {
            return [];
        }
        const sortByName = (friend1, friend2) => friend1.name.localeCompare(friend2.name);
        let previousFront = this.friends.filter(friend => friend.best).sort(sortByName);
        let result = new Set(previousFront);
        let front = 0;

        while (front < maxLevel && previousFront.length > 0) {
            let currentFront = [];
            previousFront.forEach(friend => {
                friend.friends.forEach(bro => {
                    const friendToInvite = this.friends.find(guy => guy.name === bro);
                    currentFront.push(friendToInvite);
                });
            });

            currentFront.sort(sortByName).forEach(friend => result.add(friend));
            if (currentFront.length === 0) {
                this.friends.sort(sortByName).forEach(friend => result.add(friend));
            }

            previousFront = currentFront;
            front++;
        }

        return Array.from(result).filter(friend => this.filter.gender(friend));

    },
    done() {
        return this.result.length === 0;
    },

    next() {
        return (this.result.length === 0) ? null : this.result.shift();
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
    this.maxLevel = maxLevel - 1;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.gender = friend => friend.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.gender = friend => friend.gender === 'female';
}


MaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
