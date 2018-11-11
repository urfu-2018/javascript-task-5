'use strict';

function getFriendsQueue(friends, filter, maxLevel = Infinity) {
    const friendsLevels = {};
    const tempDic = {};
    friends.forEach(x => {
        tempDic[x.name] = x;
    });
    const queue = friends.filter(x => x.best === true);
    queue
        .forEach(x => {
            friendsLevels[x.name] = 1;
        });

    for (let i = 0; i < friends.length; i++) {
        const friend = queue[i];
        if (friend === undefined) {
            continue;
        }
        friend.friends
            .filter(x => !friendsLevels.hasOwnProperty(x))
            .forEach(x => {
                friendsLevels[x] = friendsLevels[friend.name] + 1;
                queue.push(tempDic[x]);
            });
    }

    return queue
        .filter(x => filter.filter(x) && friendsLevels[x.name] <= maxLevel)
        .sort(
            (first, second) => friendsLevels[first.name] - friendsLevels[second.name] ||
                first.name.localeCompare(second.name));
}

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
    this.queue = getFriendsQueue(friends, filter);
}

Iterator.prototype = {
    next() {
        return this.done() ? null : this.queue.shift();
    },
    done() {
        return this.queue.length === 0;
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
    this.queue = getFriendsQueue(friends, filter, maxLevel);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filter = function () {
        return true;
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filter = x => x.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filter = x => x.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
