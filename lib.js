'use strict';

function getFriendsQueue(friends, filter) {
    const tempDic = {};
    const isVisited = {};
    friends
        .forEach(x => {
            tempDic[x.name] = ({ ...x });
        });
    let queue = friends.filter(x => x.best === true)
        .map(x => ({ ...x, deep: 1 }));

    queue.map(x => {
        isVisited[x.name] = 1;
    });

    friends.forEach((_, i) => {
        const friend = queue[i];
        friend.friends
            .forEach(x => {
                if (!isVisited.hasOwnProperty(x)) {
                    queue.push({ ...tempDic[x], deep: friend.deep + 1 });
                    isVisited[x] = 1;
                }
            });
    });

    return queue
        .filter(x => filter.filter(x))
        .sort(
            (first, second) => first.deep - second.deep || first.name.localeCompare(second.name));
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
        if (this.done()) {
            return null;
        }
        const friendWithDeep = this.queue.shift();
        let foundFriend = {
            name: friendWithDeep.name,
            friends: friendWithDeep.friends,
            gender: friendWithDeep.gender
        };
        if (friendWithDeep.best !== undefined) {
            foundFriend.best = friendWithDeep.best;
        }

        return foundFriend;
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
    const newFilter = {};
    newFilter.filter = x => filter.filter(x) && x.deep <= maxLevel;
    this.queue = getFriendsQueue(friends, newFilter);
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
