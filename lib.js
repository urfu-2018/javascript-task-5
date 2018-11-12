'use strict';

class FriendData {
    constructor(friend, level) {
        this.friend = friend;
        this.level = level;
    }
}

function getAllSortedFriends(friends, filter) {
    const allFriends = new Map(friends.map(x => [x.name, x]));
    const visitedFriends = new Set();
    let currentLevel = filterLevel(friends
        .filter(x => x.hasOwnProperty('best') && x.best), visitedFriends);
    let allSortedFriends = [];
    let currentLevelNum = 1;

    while (currentLevel.length !== 0) {
        currentLevel.forEach(x => visitedFriends.add(x.name));
        fillSortedFriends(allSortedFriends, currentLevel, currentLevelNum);
        currentLevel = filterLevel(currentLevel
            .map(x => x.name)
            .reduce((list, name) => {
                allFriends.get(name).friends
                    .forEach(friend => list.push(allFriends.get(friend)));

                return list;
            }, []
            ), visitedFriends);
        currentLevelNum += 1;
    }

    return allSortedFriends.filter(x => filter.isCorrect(x.friend));

    function fillSortedFriends(allSortedFriend, crLvl, num) {
        crLvl.forEach(x => allSortedFriend.push(new FriendData(x, num)));
    }

    function filterLevel(a, vf) {
        // console.info(a);

        const c = a.filter(x => !vf.has(x.name))
            .sort((x, y) => x.name.localeCompare(y.name));
        // console.info('sfser gsrthvrthrth', c);

        return c;

    }
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('Incorrect filter type!');
    }

    this.allSortedFriends = getAllSortedFriends(friends, filter);
    // console.info(this.allSortedFriends);
    this.pointer = 0;

    this.next = () => this.done() ? null : this.allSortedFriends[this.pointer++].friend;

    this.done = () => this.pointer >= this.allSortedFriends.length;
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
    Iterator.call(this, friends, filter);
    this.allSortedFriends = this.allSortedFriends.filter(x => x.level <= maxLevel);
}
Object.setPrototypeOf(LimitedIterator, Iterator);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isCorrect = function () {
        return true;
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isCorrect = x => {
        return x.gender === 'male';
    };
}
Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isCorrect = x => {
        return x.gender === 'female';
    };
}
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
