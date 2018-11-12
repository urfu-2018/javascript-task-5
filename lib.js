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

class FilterCollection extends Filter {
    constructor(...filters) {
        super();
        this.filters = filters;
    }

    isValid(person, iterator) {
        return this.filters
            .map(filter => filter.isValid(person, iterator))
            .every(value => value);
    }
}

class LimitedFilter extends Filter {
    constructor(maxLevel) {
        super();
        this.maxLevel = maxLevel;
    }

    isValid(person, iterator) {
        return iterator.friendLevel.get(person.name) <= this.maxLevel;
    }
}

class Iterator {

    /**
     * Итератор по друзьям
     * @constructor
     * @param {Object[]} friends
     * @param {Filter} filter
     */
    constructor(friends, filter) {
        if (!(filter instanceof Filter)) {
            throw new TypeError('isValid не является экземпляром Filter');
        }
        this.friendLevel = getFriendLevel(friends);
        this.friends = friends
            .filter(friend => filter.isValid(friend, this))
            .sort((first, second) => {
                if (this.friendLevel.get(first.name) === this.friendLevel.get(second.name)) {
                    return first.name.localeCompare(second.name);
                }

                return this.friendLevel.get(first.name) - this.friendLevel.get(second.name);
            });
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

function getFriendLevel(friends) {
    const friendMap = new Map(friends.map(friend => [friend.name, friend]));
    const bestFriends = friends.filter(friend => friend.best);
    const friendLevel = new Map(bestFriends.map(friend => [friend.name, 1]));
    const queue = new Queue(bestFriends);
    while (queue.length > 0) {
        const currentFriend = queue.dequeue();
        currentFriend.friends
            .filter(friend => !friendLevel.has(friend))
            .forEach(friend => {
                queue.enqueue(friendMap.get(friend));
                friendLevel.set(friend, friendLevel.get(currentFriend.name) + 1);
            });
    }

    friends
        .map(friend => friend.name)
        .filter(name => !friendLevel.has(name))
        .forEach(name => friendLevel.set(name, Infinity));

    return friendLevel;
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
        super(friends, new FilterCollection(filter, new LimitedFilter(maxLevel)));
    }
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
