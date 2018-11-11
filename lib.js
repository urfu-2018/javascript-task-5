'use strict';


function sortByName(person1, person2) {
    return person1.name.localeCompare(person2.name);
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function asOneEnumerable(sequence1, sequence2) {
    return sequence1.concat(sequence2);
}

function getNextLevelFriends(friends, friendsMap) {
    return friends
        .map(x => x.friends)
        .reduce(asOneEnumerable)
        .filter(onlyUnique)
        .map(friendName => friendsMap.get(friendName));
}

function getInvitedFriends(friends, filter, maxLevel = Infinity) {
    const friendsMap = new Map();
    friends.forEach(friend => friendsMap.set(friend.name, friend));
    let queue = friends
        .filter(friend => friend.best)
        .sort(sortByName);
    const visited = [];
    let level = 0;
    while (queue.length !== 0 && level < maxLevel) {
        visited.push(...queue);
        queue = getNextLevelFriends(queue, friendsMap)
            .filter(friend => !visited.includes(friend))
            .sort(sortByName);
        level++;
    }

    return visited.filter(filter.filterFunction);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('filter should be instance of "Filter"');
    }
    this.invitedFriends = getInvitedFriends(friends, filter);
}

Iterator.prototype = {
    done() {
        return this.invitedFriends.length === 0;
    },
    next() {
        return this.done() ? null : this.invitedFriends.shift();
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
        throw new TypeError('filter should be instance of "Filter"');
    }
    this.invitedFriends = getInvitedFriends(friends, filter, maxLevel);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filterFunction = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filterFunction = person => person.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);


/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filterFunction = person => person.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);


exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
