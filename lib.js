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
    this.generator = bfsWithFilter(friends, filter, this.maxLevel);
    let i = 0;

    this.next = function () {
        return this.done() ? null : this.generator[i++];
    };

    this.done = function () {
        return i >= this.generator.length;
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
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

class InitializeBFSCarcass {
    constructor(friends) {
        this.friends = friends;
        this.used = arrayWithZeros(friends.length);
        this.queue = friends.filter(x => x.best === true);
        this.namesDict = {};

        for (let i = 0; i < this.friends.length; ++i) {
            this.namesDict[this.friends[i].name] = i;
        }

        for (let i = 0; i < this.queue.length; ++i) {
            this.used[i] = true;
        }
    }
}

function arrayWithZeros(size) {
    let result = [size];
    for (let i = 0; i < size; i++) {
        result[i] = 0;
    }

    return result;
}

function bfsWithFilter(friends, filter, maxLevel = Infinity) {
    let bfs = new InitializeBFSCarcass(friends);
    let level = 0;
    let nextLevel = [];
    let result = [];

    function pushFriends(toFriend) {
        let friendId = bfs.namesDict[toFriend];
        if (!bfs.used[friendId]) {
            bfs.used[friendId] = true;
            nextLevel.push(bfs.friends[friendId]);
        }
    }

    function runBfs() {
        while (bfs.queue.length > 0 && level < maxLevel) {
            nextLevel = [];
            console.info(bfs.queue);
            for (let i = 0; i < bfs.queue.length; i++) {
                bfs.queue[i].friends.forEach(pushFriends);
            }

            let filteringFriends = bfs.queue.filter(f => filter.it(f));
            bfs.queue = nextLevel.sort((a, b) => a.name.localeCompare(b.name));
            ++level;
            for (let i = 0; i < filteringFriends.length; ++i) {
                result.push(filteringFriends[i]);
            }
        }
    }

    runBfs();

    return result;
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.it = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.it = friend => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.it = friend => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
