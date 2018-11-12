'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    this.sortedFriends = getSortedFriends(friends, filter);
    let i = 0;
    this.next = () => this.done() ? null : this.sortedFriends[i++].friend;
    this.done = () => i >= this.sortedFriends.length;
}

function levelFilt(currentLevelFriends, visitedFriends) {
    return currentLevelFriends
        .filter(friend => {
            return !visitedFriends.has(friend.name);
        })
        .sort((f1, f2) => {
            return f1.name.localeCompare(f2.name);
        });
}

function addFriendToArr(allSortedFriend, currentLevel, currentLevelNum) {
    const names = new Set();
    currentLevel
        .filter(item => {
            if (!names.has(item.name)) {
                return names.add(item.name);
            }

            return false;
        })
        .forEach(friend => allSortedFriend.push({
            friend: friend,
            friendLevel: currentLevelNum
        }));
}

function getSortedFriends(friends, filter) {
    let visitedFriends = new Set();
    let allFriends = new Map(friends.map(x => [x.name, x]));
    let allSortedFriends = [];
    let i = 1;
    let currentLevel = levelFilt(friends.filter(x => x.best), visitedFriends);
    while (currentLevel.length !== 0) {
        currentLevel.forEach(x => {
            visitedFriends.add(x.name);
        });
        addFriendToArr(allSortedFriends, currentLevel, i);
        let curLevelFriends = currentLevel
            .map(x => x.name)
            .reduce((list, name) => friendsReducer(list, name, allFriends), []);
        currentLevel = levelFilt(curLevelFriends, visitedFriends);
        i += 1;
    }

    return allSortedFriends.filter(x => {
        return filter.isCorrect(x.friend);
    });
}

function friendsReducer(list, name, allFriends) {
    allFriends.get(name)
        .friends
        .forEach(friend => list.push(allFriends.get(friend)));

    return list;
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
    this.sortedFriends = this.sortedFriends.filter(friend => friendLvlFilter(friend, maxLevel));
}

function friendLvlFilter(friend, maxLevel) {
    return friend.friendLevel <= maxLevel;
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isCorrect = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isCorrect = x => x.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isCorrect = x => x.gender === 'female';

}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;
exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
