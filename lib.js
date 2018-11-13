'use strict';

function bestFriendSort(x, y) {
    if (x === y) {
        return 0;
    }

    return x ? -1 : 1;
}

function getFriends(person, persons) {
    const friendsNames = new Set(person.friends);
    let result = [];

    for (const p of persons) {
        if (friendsNames.has(p.name)) {
            result.push(p);
        }
    }

    result = result.sort(bestFriendSort);

    return result;
}

function addFriendsToQueue(person, queue, persons, deepLevel) {
    if (deepLevel > 0) {
        for (const friend of getFriends(person, persons)) {
            queue.push({ deepLevel, 'currentPerson': friend });
        }
    }
}

function* makeIterator(persons, filter, maxLevel) {
    const invitedFriends = new Set();
    persons = persons.sort((a, b) => a.name.localeCompare(b.name));
    const queue = persons
        .filter(p => p.best === true)
        .map(person => ({ 'deepLevel': maxLevel, 'currentPerson': person }));

    while (queue.length !== 0) {
        const { deepLevel, currentPerson } = queue.shift();

        if (invitedFriends.has(currentPerson)) {
            continue;
        }

        invitedFriends.add(currentPerson);
        if (filter.predicate(currentPerson)) {
            yield currentPerson;
        }
        addFriendsToQueue(currentPerson, queue, persons, deepLevel - 1);
    }
}

const iterator = {
    init(iter) {
        this.iter = iter;
        this.nextElement = this.iter.next();
    },

    next() {
        const result = this.nextElement.value;
        this.nextElement = this.iter.next();

        return result;
    },

    done() {
        return this.nextElement.done;
    }
};

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

    const iter = Object.create(iterator);
    iter.init(makeIterator(friends, filter, Number.POSITIVE_INFINITY));

    return iter;
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
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    const iter = Object.create(iterator);
    iter.init(makeIterator(friends, filter, maxLevel));

    return iter;
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = undefined;
    this.predicate = function (record) {
        return !this.gender || this.gender === record.gender;
    }.bind(this);
}

const filterPrototype = new Filter();

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Filter.call(this);
    this.gender = 'male';
}

MaleFilter.prototype = filterPrototype;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Filter.call(this);
    this.gender = 'female';
}

FemaleFilter.prototype = filterPrototype;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
