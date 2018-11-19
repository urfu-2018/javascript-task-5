'use strict';

class FriendData {
    constructor(friend, level) {
        this.friend = friend;
        this.level = level;
    }
}

/**
 * Добавляет в массив, содержащий друзей в указанном в задаче порядке, друзей уровня num
 * @param {FriendData[]} allSortedFriend
 * @param {Object[]} crLvl
 * @param {Number} num
 */
Iterator.prototype.fillSortedFriends = function (allSortedFriend, crLvl, num) {
    crLvl = this.removeDuplicates(crLvl);
    crLvl.forEach(x => allSortedFriend.push(new FriendData(x, num)));
};

/**
 * Фильтрует переданный уровень друзей по вхождению
 * в итоговый список, а затем лексикографическси сортирует
 * @param {Object[]} currLevel
 * @param {Set} visitedFriends
 * @returns {Object[]}
 */
Iterator.prototype.filterAndSortLevel = function (currLevel, visitedFriends) {
    return currLevel.filter(x => !visitedFriends.has(x.name))
        .sort((x, y) => x.name.localeCompare(y.name));
};

/**
 * Удаляет дубли из массива
 * @param {Object[]} arr
 * @returns {Object[]}
 */
Iterator.prototype.removeDuplicates = function (arr) {
    const names = new Set();

    return arr.filter(item => !names.has(item.name) ? names.add(item.name) : false);
};

/**
 * Преобразует исходные данные о друзьях в массив FriendData, применяя указанный фильтр
 * @param {Object[]} friends
 * @param {Filter} filter
 * @returns {FriendData[]}
 */
Iterator.prototype.getAllSortedFriends = function (friends, filter) {
    const allFriends = new Map(friends.map(friend => [friend.name, friend]));
    const visitedFriends = new Set();
    let currentLevel = this.filterAndSortLevel(friends.filter(x => x.best), visitedFriends);
    let allSortedFriends = [];
    let currentLevelNum = 1;

    while (currentLevel.length !== 0) {
        currentLevel.forEach(friend => visitedFriends.add(friend.name));
        this.fillSortedFriends(allSortedFriends, currentLevel, currentLevelNum);
        currentLevel = this.filterAndSortLevel(currentLevel
            .map(x => x.name)
            .reduce((list, name) => {
                allFriends.get(name).friends.forEach(friend => list.push(allFriends.get(friend)));

                return list;
            }, []
            ), visitedFriends);
        currentLevelNum += 1;
    }

    return allSortedFriends.filter(x => filter.isCorrect(x.friend));
};

/**
 * Возвращает очередной элемент итератора
 * @returns {Object}
 */
Iterator.prototype.next = function () {
    return this.done() ? null : this.allSortedFriends[this.pointer++].friend;
};

/**
 * Возвращает true, если перечисление завершено и false в противном случае
 * @returns {Boolean}
 */
Iterator.prototype.done = function () {
    return this.pointer >= this.allSortedFriends.length;
};

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

    this.allSortedFriends = this.getAllSortedFriends(friends, filter);
    this.pointer = 0;
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
