'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    this.friendsWrapper = filterAndOrder(friends, filter);
}

Object.assign(Iterator.prototype, {
    done() {
        const friendsWrapper = this.friendsWrapper;

        return friendsWrapper.friends.length === friendsWrapper.current;
    },
    next() {
        const friendsWrapper = this.friendsWrapper;

        return this.done()
            ? null
            : friendsWrapper.friends[friendsWrapper.current++].object;
    }
});

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    this.friendsWrapper = filterAndOrder(friends, filter, maxLevel);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = 'all';
}

Object.assign(Filter.prototype, {
    apply(friend) {
        return friend.gender === this.gender ||
            this.gender === 'all';
    }
});

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.gender = 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.gender = 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

function filterAndOrder(friends, filter, maxLevel = Number.POSITIVE_INFINITY) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
    let temp = friends
        .map(friend => {
            return {
                object: friend,
                level: friend.best ? 1 : Number.POSITIVE_INFINITY
            };
        });

    temp = bubbleSort(temp)
        .filter(friend => filter.apply(friend.object))
        .filter(friend => friend.level <= maxLevel &&
            friend.level !== Number.POSITIVE_INFINITY);

    return {
        current: 0,
        friends: temp
    };
}

function bubbleSort(friends) {
    for (let i = 0; i < friends.length; i++) {
        for (let j = i + 1; j < friends.length; j++) {
            bubbleSortInternal(friends, i, j);
        }
    }

    return friends;
}

function bubbleSortInternal(friends, i, j) {
    const friendA = friends[i];
    const friendB = friends[j];

    if (friendA.level === friendB.level) {
        if (friendA.object.name >= friendB.object.name) {
            swap(friends, i, j);
        }
    } else if (friendA.level < friendB.level) {
        correctLevel(friendA, friendB);
    } else if (friendA.level > friendB.level) {
        correctLevel(friendB, friendA);
        swap(friends, i, j);
    }

}

function correctLevel(lowLevelFriend, highLevelFriend) {
    if (lowLevelFriend.object.friends.includes(highLevelFriend.object.name)) {
        highLevelFriend.level = lowLevelFriend.level + 1;
    }
}

function swap(friends, i, j) {
    const temp = friends[i];
    friends[i] = friends[j];
    friends[j] = temp;
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
