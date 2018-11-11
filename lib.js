'use strict';

function getFriendsQueue(friends, filter, maxLevel = Infinity) {
    const tempDic = {};
    const friendsLevels = {};
    friends
        .forEach(x => {
            tempDic[x.name] = ({ ...x });
        });
    let queue = friends.filter(x => x.best === true)
        .map(x => ({ ...x }));

    queue.forEach(x => {
        friendsLevels[x.name] = 1;
    });

    friends.forEach((_, i) => {
        const friend = queue[i];
        friend.friends
            .forEach(x => {
                if (!friendsLevels.hasOwnProperty(x)) {
                    queue.push({ ...tempDic[x] });
                    friendsLevels[x] = friendsLevels[friend.name] + 1;
                }
            });
    });

    queue = queue
        .filter(x => filter.filter(x) && friendsLevels[x.name] <= maxLevel)
        .sort(
            (first, second) => friendsLevels[first.name] - friendsLevels[second.name] ||
                first.name.localeCompare(second.name));

    return queue;
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
