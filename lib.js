'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    var priorityFriends = addPriorities(friends);
    priorityFriends.sort(friendsSortFunction);
    priorityFriends = removePriorities(priorityFriends);
    // console.info(friends);
    if (filter instanceof Filter) {

        return {
            currentIndex: 0,
            friendsIndexes: filterFriends(priorityFriends, filter),
            next: function () {
                return (this.done()) ? null
                    : priorityFriends[this.friendsIndexes[this.currentIndex++]];
            },

            done: function () {
                return this.currentIndex === this.friendsIndexes.length;
            }
        };
    }

    throw new TypeError();
}

function removePriorities(friends) {
    friends.forEach(function (t) {
        delete t.priority;
    });

    return friends;
}

function addPriorities(friends) {
    // var a = friends.slice();
    const a = friends.map(b => ({ ...b }));
    const bestFriends = getBestFriendsIndexes(friends, 1);
    a.forEach(function (t) {
        var bestFriendsCounter = 0;
        t.friends.forEach(function (value) {
            var friendIndex = findFriendIndex(friends, value);
            if (bestFriends.indexOf(friendIndex) !== -1) {
                bestFriendsCounter++;
            }
        });
        t.priority = bestFriendsCounter;
    });

    return a;
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
    // 1 лучшие друзья
    // 2 друзья лучших друзей
    Object.setPrototypeOf(this, new Iterator(friends, filter));
    if (maxLevel === 0) {
        return this;
    }
    const bestFriendsIndexes = new Set(getBestFriendsIndexes(friends, maxLevel));
    // this.friendsIndexes filtered male indexes
    this.friendsIndexes = filterIndexes(this.friendsIndexes, bestFriendsIndexes);

    return this;
}

function filterIndexes(friendsIndexes, bestFriendsIndexes) {
    var result = [];
    bestFriendsIndexes.forEach(function (t) {
        if (friendsIndexes.indexOf(t) !== -1) {
            result.push(t);
        }
    });

    return result;
}

function filterFriends(friends, filter) {
    var resultIndexes = [];
    friends.forEach(function (values, index) {
        if (filter.isAvailable(values)) {
            resultIndexes.push(index);
        }
    });

    return resultIndexes;
}

function getBestFriendsIndexes(friends, maxLevel) {
    const bestFriendsIndexes = [];
    friends.forEach(function (i, index) {
        if (i.hasOwnProperty('best')) {
            bestFriendsIndexes.push(index);
        }
    });
    if (maxLevel <= 1) {
        return bestFriendsIndexes;
    }

    return goThrough(bestFriendsIndexes, maxLevel, friends);
}

function goThrough(bestFriendsIndexes, maxLevel, friends) {
    // bestfriends indexes
    // maxlevel
    // friends all

    var queue = Object.assign([], bestFriendsIndexes);
    var currentStep = 0;
    var amountOnLayer = bestFriendsIndexes.length;
    var visitedNodes = [];
    while (currentStep !== maxLevel - 1) {
        var i = 0;
        while (i !== amountOnLayer && queue.length > 0) {
            var firstEl = queue.shift();
            visitedNodes.push(firstEl);
            friends[firstEl].friends.forEach(function (t) {
                var friendIndex = findFriendIndex(friends, t);
                if (friendIndex !== -1 && queue.indexOf(friendIndex) === -1 &&
                    visitedNodes.indexOf(friendIndex) === -1) {
                    queue.push(friendIndex);
                }
            });
            i++;
        }
        amountOnLayer = queue.length;
        currentStep++;
    }

    return visitedNodes.concat(queue).sort();
}

function findFriendIndex(friends, friendName) {
    var result = -1;
    friends.forEach(function (t, index) {
        if (t.name === friendName) {
            result = index;
        }
    });

    return result;
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    Object.defineProperty(this, 'isAvailable', {
        value: function () {

            return true;
        },
        writable: true
    });

    return this;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {

    Object.setPrototypeOf(this, new Filter());
    Object.defineProperty(this, 'isAvailable', {
        value: function (a) {
            return a.gender === 'male';
        }
    });


    return this;
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    // var femaleFilter = {};
    Object.setPrototypeOf(this, new Filter());
    Object.defineProperty(this, 'isAvailable', {
        value: function (a) {
            return a.gender === 'female';
        }
    });

    return this;
}

function friendsSortFunction(firstFriend, secondFriend) {
    const isBest = secondFriend.hasOwnProperty('best') - firstFriend.hasOwnProperty('best');
    if (isBest) {
        return isBest;
    }

    return firstFriend.name.localeCompare(secondFriend.name) &&
        firstFriend.priority <= secondFriend.priority;
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
