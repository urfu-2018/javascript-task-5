'use strict';

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

    const friendsList = getFriendsList(friends, filter, this.maxLevel);
    let pointer = 0;

    this.next = function () {
        return this.done() ? null : friendsList[pointer++];
    };
    this.done = function () {
        return pointer >= friendsList.length;
    };
}

/**
 * Итератор по друзьям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.predicate = () => true;
}


/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.predicate = person => person.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.predicate = person => person.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

function getFriendsList(friends, filter, maxLevel = Infinity) {
    const friendsList = [];
    getFriendCircles(friends, maxLevel)
        .forEach(circle => friendsList.push(...circle.filter(filter.predicate)));

    return friendsList;
}

function getFriendCircles(friendsBook, maxLevel) {
    const friendsCircles = [];
    let previous = friendsBook.filter(friend => friend.best);
    let level = 0;

    while (previous.length !== 0 && level < maxLevel) {
        previous.sort((a, b) => a.name.localeCompare(b.name));
        friendsCircles.push(previous);
        const current = [];
        previous.forEach(friend => {
            current.push(...friend.friends
                .map(name => getFriendByName(name, friendsBook))
                .filter(person => {
                    for (const circle of friendsCircles) {
                        if (circle.includes(person) || current.includes(person)) {
                            return false;
                        }
                    }

                    return true;
                })
            );
        });
        previous = current;
        level++;
    }

    return friendsCircles;
}

function getFriendByName(name, friends) {
    return friends.find(friend => friend.name === name);
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
