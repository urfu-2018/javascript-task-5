'use strict';

function compareComparable(first, second) {
    if (first < second) {
        return -1;
    }

    return (first === second) ? 0 : 1;
}

function getFriendsSorted(friends) {
    friends = friends.slice();
    friends.sort((first, second) => compareComparable(first, second));

    return friends;
}

function notUsed(items, used) {
    return items.filter(item => !used.has(item));
}

function getNextWave(friendsMap, wave, used) {
    let newWave = [];
    for (let name of wave) {
        newWave.push(...notUsed(friendsMap.get(name).friends, used));
    }

    return getFriendsSorted(newWave);
}

function getBest(friends) {
    let best = [];
    for (let friend of friends) {
        if (friend.best) {
            best.push(friend.name);
        }
    }

    return best;
}

function toFriendsMap(friends) {
    let friendsMap = new Map();
    for (let friend of friends) {
        friendsMap.set(friend.name, friend);
    }

    return friendsMap;
}


/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('filter is not instance of Filter');
    }
    this.wave = getFriendsSorted(getBest(friends));
    this.friendsMap = toFriendsMap(friends);
    this.used = new Set();
    this.index = 0;
    this.finished = false;
    this.maxLevel = -1;
    this.level = 0;
    this.filter = filter;
}

Iterator.prototype = {
    constructor: {
        value: Iterator
    },

    updateWaveIfNecessary: function () {
        if (this.wave.length === this.index) {
            this.level++;
            if (this.level === this.maxLevel) {
                return;
            }
            this.wave = getNextWave(this.friendsMap, this.wave, this.used);
            this.index = 0;
        }
    },

    isAtEnd: function () {
        return this.wave.length === this.index;
    },

    getCurrent: function () {
        return this.friendsMap.get(this.wave[this.index]);
    },

    moveToNext: function () {
        this.used.add(this.getCurrent().name);
        this.index++;
    },

    skipToNextValid: function () {
        this.updateWaveIfNecessary();
        while (!this.isAtEnd() && !this.filter.isValid(this.getCurrent())) {
            this.moveToNext();
            this.updateWaveIfNecessary();
        }
    },

    next: function () {
        if (this.finished) {
            return null;
        }
        this.skipToNextValid();
        let nextFriend = this.isAtEnd() ? null : this.getCurrent();
        if (!this.isAtEnd()) {
            this.moveToNext();
        }

        return nextFriend;
    },

    done: function () {
        let isDone = this.next() === null;
        if (isDone === null) {
            this.finished = true;
        } else {
            this.index--;
        }

        return isDone;
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
    Iterator.call(this, friends, filter);
    this.maxLevel = maxLevel;
}

LimitedIterator.prototype = Object.create(Iterator.prototype, {
    constructor: {
        value: LimitedIterator
    }
});

/**
 * Фильтр друзей
 * @constructor
 */
// eslint-disable-next-line no-empty-function
function Filter() {
    this.isValid = function () {
        return true;
    };
}

Filter.prototype = {
    constructor: {
        value: Filter
    }
};

function filterGender(gender) {
    return function (friend) {
        return friend.gender === gender;
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isValid = filterGender('male');
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isValid = filterGender('female');
}

for (let genderFilter of [MaleFilter, FemaleFilter]) {
    genderFilter.prototype = Object.create(Filter.prototype, {
        constructor: {
            value: genderFilter
        }
    });
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
