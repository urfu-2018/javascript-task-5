'use strict';

function friendsComaprer(a, b) {
    if (a.best && !b.best) {
        return -1;
    }
    if (!a.best && b.best) {
        return 1;
    }

    return a.name.localeCompare(b.name);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    console.info(friends, filter);
    friends = friends.filter(filter);
    friends.sort(friendsComaprer);
    const iterator = {
        isDone: false,
        index: 0,
        friends: friends,

        next: function () {
            if (this.friends.length > this.index) {
                this.index += 1;

                return this.friends[this.index - 1];
            }
            this.isDone = true;

            return null;
        },

        done: function () {
            return this.isDone;
        }
    };

    return iterator;
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
    console.info(friends, filter, maxLevel);
    friends = getFriendsByCircleDepth(friends, maxLevel);

    return new Iterator(friends, filter);
}

function getFriendsByCircleDepth(friends, depth) {
    let friendsMap = new Map();
    friends.forEach(x => friendsMap.set(x.name, x));
    let circle = friends.filter(x => x.best);
    circle.sort(friendsComaprer);
    circle = new Set(circle);
    for (let i = 1; i < depth; i++) {
        let newCircle = [];
        for (let friend of circle) {
            friend.friends.forEach(name => newCircle.push(friendsMap.get(name)));
        }
        newCircle.sort(friendsComaprer);
        circle = new Set([...circle, ...newCircle]);
    }

    return [...circle];
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');
    this.condition = function () {
        return true;
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');
    this.condition = function (friend) {
        return friend.gender === 'male';
    };

    return this.condition;
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');
    this.condition = function (friend) {
        return friend.gender === 'female';
    };

    return this.condition;
}


FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
