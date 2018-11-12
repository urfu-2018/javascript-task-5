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

    // this.maxLevel = Infinity;
    // const friendsList = getFriendsList(friends, this.maxLevel)
    //     .filter(filter.predicate);

    this.friendsList = getFriendsList(friends, filter);
    let pointer = 0;

    this.next = function () {
        return this.friendsList[pointer++];
    };
    this.done = function () {
        return pointer >= this.friendsList.length;
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
    Iterator.call(this, friends, filter);
    // this.maxLevel = maxLevel;
    this.friendsList = getFriendsList(friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.predicate = () => true;
    // this.setPrecicate = function (predicate) {
    //     this.predicate = predicate;
    // };
}

const filterProto = new Filter();

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    // super.setPredicate(person => person.gender === 'male');
    this.predicate = person => person.gender === 'male';
}

MaleFilter.prototype = filterProto;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.predicate = person => person.gender === 'female';
}

FemaleFilter.prototype = filterProto;

function getFriendsList(friends, filter, maxLevel = Infinity) {
    const friendsList = [];
    getFriendCircles(friends, maxLevel)
        .forEach(circle => friendsList.push(...circle.filter(filter.predicate)));

    return friendsList;
}

function getFriendCircles(friendsBook, maxLevel) {
    const friendsCircles = [];
    let previousFriendsCircle = friendsBook.filter(friend => friend.best);
    friendsCircles.push(previousFriendsCircle);
    let level = 0;

    do {
        if (level === maxLevel) {
            break;
        }
        previousFriendsCircle.sort((a, b) => a.name.localeCompare(b.name));
        const friendsCircle = [];
        friendsCircles.push(friendsCircle);
        previousFriendsCircle.forEach(friend => {
            friendsCircle.push(...friend.friends
                .map(name => friendsBook.find(person => person.name === name))
                .filter(person => {
                    for (const circle of friendsCircles) {
                        if (circle.includes(person)) {
                            return false;
                        }
                    }

                    return true;
                })
            );
        });
        previousFriendsCircle = friendsCircle;
        level++;
    }
    while (previousFriendsCircle.length !== 0);

    return friendsCircles.slice(0, -1);
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
