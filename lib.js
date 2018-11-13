'use strict';

function getBestFriends(friends) {
    return friends
        .filter(friend => friend.best)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(function (friend) {
            friend.priority = 0;

            return friend;
        });
}

function addNextLevel(current, friends, visited, queue) {
    for (let i = 0; i < current.friends.length; ++i) {
        const friendName = current.friends[i];
        const friend = friends.find(fr => fr.name === friendName);
        if (!friend.hasOwnProperty('priority')) {
            friend.priority = current.priority + 1;
        }
        if (!visited.has(friendName)) {
            queue.push(friend);
            visited.add(friendName);
        }
    }
}

function* bfs(friends) {
    const queue = getBestFriends(friends);
    const visited = new Set(queue.map(friend => friend.name));
    let currentPriority = 0;
    while (queue.length > 0) {
        if (currentPriority !== queue[0].priority) {
            queue.sort((a, b) => a.name.localeCompare(b.name));
            ++currentPriority;
        }
        const current = queue.shift();
        addNextLevel(current, friends, visited, queue);
        yield current;
    }

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
    const iter = bfs(friends);
    let next = iter.next();
    this.current = function () {
        return next;
    };
    this.done = function () {
        while (!next.done && !filter.filter(next.value)) {
            next = iter.next();
        }

        return next.done;
    };
    this.next = function () {
        while (!next.done && !filter.filter(next.value)) {
            next = iter.next();
        }
        let value = next.done ? null : next.value;
        next = iter.next();

        return value;
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
    console.info(friends, filter, maxLevel);
    const limitedFilter = new Filter();
    limitedFilter.filter = fr => filter.filter(fr) && fr.priority < maxLevel;

    const limitedIterator = new Iterator(friends, limitedFilter);
    this.done = limitedIterator.done;
    this.next = limitedIterator.next;
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');
    this.filter = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');
    // this.prototype = Filter;
    this.filter = friend => friend.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');
    // this.prototype = Filter;
    this.filter = friend => friend.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
