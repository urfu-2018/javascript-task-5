'use strict';

const sortByName = function (friend1, friend2) {
    return friend1.name.localeCompare(friend2.name);
};

function removeDuplicatesAndSort(people) {
    const set = [];
    people.forEach(person => {
        if (!set[person.name]) {
            set[person.name] = person;
        }
    });

    return Object.values(set).sort((a, b) => a.name.localeCompare(b.name));
}

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
        let previousFront = removeDuplicatesAndSort(this.friends
            .filter(friend => friend.best).sort(sortByName));
        let invited = (previousFront.map(friend => friend.name));
        let result = new Set(previousFront);
        let front = 0;

        while (front < maxLevel && invited.length !== this.friends.length) {
            let currentFront = [];
            previousFront.forEach(friend => {
                friend.friends.forEach(bro => {
                    const friendToInvite = this.friends.find(guy => guy.name === bro);
                    if (friendToInvite && invited.indexOf(bro) === -1) {
                        currentFront.push(friendToInvite);
                        invited.push(bro);
                    }
                });
            });

            currentFront.sort(sortByName).forEach(friend => result.add(friend));
            if (currentFront.length === 0) {

                result.add(this.friends.filter(friend =>
                    invited.indexOf(friend.name) === -1).sort(sortByName));
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
