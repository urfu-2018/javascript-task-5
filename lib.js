'use strict';

function getBestFriends(friends) {
    return friends
        .filter(friend => friend.best)
        .sort((a, b) => a.name > b.name)
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
            queue.sort((a, b) => a.name > b.name);
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
    if (filter.prototype.name !== 'Filter') {
        throw new TypeError();
    }
    const iter = bfs(friends);
    let next = iter.next();

    return {
        current: function () {
            return next;
        },
        done: function () {
            while (!next.done && !filter.filter(next.value)) {
                next = iter.next();
            }

            return next.done;
        },
        next: function () {
            while (!next.done && !filter.filter(next.value)) {
                next = iter.next();
            }
            let value = next.done ? null : next.value;
            delete value.priority;
            next = iter.next();

            return value;
        }
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

    return new Iterator(friends, {
        filter: fr => filter.filter(fr) && fr.priority < maxLevel,
        prototype: Filter
    });
}

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
    this.prototype = Filter;
    this.filter = friend => friend.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');
    this.prototype = Filter;
    this.filter = friend => friend.gender === 'female';
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
