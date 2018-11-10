'use strict';

Iterator.prototype = {
    invitedFriends: [],
    index: 0,
    done() {
        return this.index >= this.invitedFriends.length;
    },
    next() {
        if (this.done()) {
            return null;
        }

        return this.invitedFriends[this.index++];
    }
};

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);
Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('Объект фильтра не является инстансом функции-конструктора Filter.');
    }
    this.invitedFriends = getFriends({ friends })
        .filter(friend => filter.isEligible(friend));
    this.index = 0;
}

/**
 * Итератор по друзьям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    Iterator.apply(this, [friends, filter]);
    this.invitedFriends = getFriends({ friends, maxLevel })
        .filter(friend => filter.isEligible(friend));
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isEligible = function () {
        return true;
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isEligible = function (friend) {
        return friend.gender === 'male';
    };
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isEligible = function (friend) {
        return friend.gender === 'female';
    };
}

function getFriends({ friends, maxLevel = Infinity }) {
    let result = [];
    if (maxLevel < 1) {
        return result;
    }
    let currentLevelFriends = friends.filter(friend => friend.best)
        .sort((a, b) => a.name.localeCompare(b.name));
    if (currentLevelFriends.length === 0) {
        return result;
    }
    result = result.concat(currentLevelFriends);
    for (let i = 2; i <= maxLevel; i++) {
        currentLevelFriends = getNextLevelFriends(currentLevelFriends, result, friends);
        if (currentLevelFriends.length === 0) {
            break;
        }
        result = result.concat(currentLevelFriends);
    }

    return result;
}

function getNextLevelFriends(currentLevelFriends, invitedFriends, allFriends) {
    const names = currentLevelFriends.reduce((accumulator, friend) => {
        return accumulator.concat(friend.friends);
    }, []);
    const friends = names.map(name => {
        return allFriends.find(friend => name === friend.name);
    });
    let currentIndex = 0;
    let nextLevelFriends = friends.filter(friend => !invitedFriends.includes(friend));
    nextLevelFriends = nextLevelFriends.filter(friend => {
        return nextLevelFriends.indexOf(friend) === currentIndex++;
    });

    return nextLevelFriends.sort((a, b) => a.name.localeCompare(b.name));
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
