'use strict';

function getInvatedFriends(friends, maxLevel = Infinity) {
    let invatedFriends = [];
    let currentPriorityFriends = [];
    currentPriorityFriends = friends.filter(friend => friend.best)
        .sort((friend1, friend2) => friend1.name.localeCompare(friend2.name));
    while (maxLevel > 0 && currentPriorityFriends.length !== 0) {
        currentPriorityFriends.forEach(guest => {
            if (!invatedFriends.includes(guest)) {
                invatedFriends.push(guest);
            }
        });
        currentPriorityFriends = currentPriorityFriends
            .reduce((acc, person) => [...acc, ...person.friends], [])
            .map(name => friends.find(friend => friend.name === name))
            .filter(friend => !invatedFriends.includes(friend))
            .sort((friend1, friend2) => friend1.name.localeCompare(friend2.name));
        maxLevel--;
    }

    return invatedFriends;
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

    this.filterFriends = getInvatedFriends(friends, this.maxLevel).filter(filter.thisRightPerson);
    this.done = function () {
        return this.filterFriends.length === 0;
    };
    this.next = function () {
        if (this.done()) {

            return null;
        }

        return this.filterFriends.shift();
    };
}

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
    this.filterFriends = getInvatedFriends(friends, maxLevel).filter(filter.thisRightPerson);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.thisRightPerson = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.thisRightPerson = people => people.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.thisRightPerson = people => people.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
