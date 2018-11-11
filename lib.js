'use strict';

function getFriensQueue(friends, filter) {
    const tempArray = {};
    friends
        .forEach(x => {
            tempArray[x.name] = ({ ...x });
        });
    let queue = friends.filter(x => x.best === true)
        .map(x => ({ ...x }));

    queue.forEach(x => {
        x.deep = 1;
        delete tempArray[x.name];
    });

    friends.forEach((_, i) => {
        const friend = queue[i];
        friend.friends.forEach(y => {
            if (tempArray[y] !== undefined) {
                friend[y] = tempArray[y];
                friend[y].deep = friend.deep + 1;
                delete tempArray[y];
                queue.push(friend[y]);
            }
        });
    });

    return queue.sort(
        (first, second) => first.deep - second.deep || first.name.localeCompare(second.name))
        .filter(x => filter.filter(x));
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
    this.queue = getFriensQueue(friends, filter);
}

Iterator.prototype = {
    next() {
        if (this.done()) {
            return null;
        }
        let friendWithDeep = this.queue.shift();
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
    Object.setPrototypeOf(this, new Iterator(friends, filter));
    this.queue = this.queue.filter(x => x.deep <= maxLevel);
    console.info(friends, filter, maxLevel);
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
