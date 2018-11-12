'use strict';


/**
 * Фильтр друзей
 */

class Filter {
    isValid() {
        return true;
    }
}

/**
 * Фильтр друзей
 * @extends Filter
 */
class MaleFilter extends Filter {
    isValid(person) {
        return person.gender === 'male';
    }
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 */
class FemaleFilter extends Filter {
    isValid(person) {
        return person.gender === 'female';
    }
}


class Iterator {

    /**
     * Итератор по друзьям
     * @constructor
     * @param {Object[]} friends
     * @param {Filter} filter
     * @param {Number} maxLevel
     */
    constructor(friends, filter, maxLevel = Infinity) {
        if (!(filter instanceof Filter)) {
            throw new TypeError('filter не является экземпляром Filter');
        }
        this.friends = getInvitedFriends(friends, filter, maxLevel);
        this.index = 0;
    }

    next() {
        if (!this.done()) {
            const friend = this.friends[this.index];
            this.index++;

            return friend;
        }

        return null;
    }

    done() {
        return this.index >= this.friends.length;
    }
}

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
                queue.enqueue(friendMap.get(friend));
                friendLevel.set(friend, level);
            });
    }

    return friendLevel;
}

function getInvitedFriends(friends, filter, maxLevel) {
    const friendLevel = getFriendLevel(friends, maxLevel);

    return friends
        .filter(friend => friendLevel.has(friend.name))
        .filter(friend => filter.isValid(friend))
        .sort((first, second) => {
            if (friendLevel.get(first.name) === friendLevel.get(second.name)) {
                return first.name.localeCompare(second.name);
            }

            return friendLevel.get(first.name) - friendLevel.get(second.name);
        });
}

class LimitedIterator extends Iterator {

    /**
     * Итератор по друзям с ограничением по кругу
     * @extends Iterator
     * @constructor
     * @param {Object[]} friends
     * @param {Filter} filter
     * @param {Number} maxLevel – максимальный круг друзей
     */
    constructor(friends, filter, maxLevel) {
        super(friends, filter, maxLevel);
    }
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
