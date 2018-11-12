'use strict';


/**
 * Фильтр друзей
 */

function Filter() {
    this.isValid = function () {
        return true;
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 */
function MaleFilter() {
    this.isValid = function (person) {
        return person.gender === 'male';
    };
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 */
function FemaleFilter() {
    this.isValid = function (person) {
        return person.gender === 'female';
    };
}

FemaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel
 */
function Iterator(friends, filter, maxLevel = Infinity) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('filter не является экземпляром Filter');
    }
    this.friendLevel = getFriendLevel(friends, maxLevel);
    this.friends = friends
        .filter(friend => this.friendLevel.has(friend.name))
        .filter(friend => filter.isValid(friend))
        .sort((first, second) => {
            if (this.friendLevel.get(first.name) === this.friendLevel.get(second.name)) {
                return first.name.localeCompare(second.name);
            }

            return this.friendLevel.get(first.name) - this.friendLevel.get(second.name);
        });
    this.index = 0;
}

Iterator.prototype.next = function () {
    if (!this.done()) {
        const friend = this.friends[this.index];
        this.index++;

        return friend;
    }

    return null;
};

Iterator.prototype.done = function () {
    return this.index >= this.friends.length;
};

class Queue {
    constructor(iterable) {
        this.first = null;
        this.last = null;
        this.queueLength = 0;
        if (iterable) {
            iterable.forEach(item => this.enqueue(item));
        }
    }

    enqueue(item) {
        this.queueLength++;
        const queueItem = { item: item, next: null };
        if (this.first === null) {
            this.first = queueItem;
            this.last = queueItem;
        } else {
            this.last.next = queueItem;
            this.last = queueItem;
        }
    }

    dequeue() {
        const item = this.first.item;
        this.first = this.first.next;
        if (this.first === null) {
            this.last = null;
        }
        this.queueLength--;

        return item;
    }

    get length() {
        return this.queueLength;
    }
}

function getFriendLevel(friends, maxLevel) {
    const friendMap = new Map(friends.map(friend => [friend.name, friend]));
    const bestFriends = friends.filter(friend => friend.best);
    const friendLevel = new Map(bestFriends.map(friend => [friend.name, 1]));
    const queue = new Queue(bestFriends);
    while (queue.length > 0) {
        const currentFriend = queue.dequeue();
        currentFriend.friends
            .filter(friend => !friendLevel.has(friend))
            .forEach(friend => {
                const level = friendLevel.get(currentFriend.name) + 1;
                if (level <= maxLevel) {
                    queue.enqueue(friendMap.get(friend));
                    friendLevel.set(friend, level);
                }
            });
    }

    return friendLevel;
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
    Iterator.call(this, friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
