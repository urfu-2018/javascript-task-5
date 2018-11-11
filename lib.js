'use strict';

/**
 * Сравнение для имен
 * @constructor
 * @param {Object} person1
 * @param {Object} person2
 * @returns {number}
 */
function compareForName(person1, person2) {
    let result = 0;
    if (person1.name < person2.name) {
        result = -1;
    }
    if (person1.name > person2.name) {
        result = 1;
    }

    return result;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
    friends = (friends.sort(compareForName)); // нужные в алфавитном порядке
    let currentFriendList = getBestFriends(friends); // список имен
    let listOfAllFriends = currentFriendList;
    while (listOfAllFriends.length < friends.length) {
        currentFriendList = getCircle(currentFriendList);
        currentFriendList = getVertex(friends, currentFriendList);
        listOfAllFriends = getFriendsList(currentFriendList, listOfAllFriends);
    }
    listOfAllFriends = listOfAllFriends.filter(fr => filter.isNecessary(fr));
    this.index = 0;
    this.done = function () {
        return this.index >= listOfAllFriends.length;
    };
    this.next = function () {
        this.index++;

        return listOfAllFriends[this.index - 1] ? listOfAllFriends[this.index - 1] : null;
    };

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

    friends = (friends.sort(compareForName)); // нужные в алфавитном порядке
    const basicIterator = new Iterator(friends, filter);
    const limitedIterator = Object.create(basicIterator);
    limitedIterator.index = basicIterator.index;
    let currentFriendList = getBestFriends(friends); // список имен
    let listOfAllFriends = currentFriendList;
    for (let i = 1; i < maxLevel; i++) {
        currentFriendList = getCircle(currentFriendList);
        currentFriendList = getVertex(friends, currentFriendList);
        listOfAllFriends = getFriendsList(currentFriendList, listOfAllFriends);
    }
    listOfAllFriends = listOfAllFriends.filter(fr => filter.isNecessary(fr));
    limitedIterator.done = function () {
        return limitedIterator.index >= listOfAllFriends.length || maxLevel === 0;
    };
    limitedIterator.next = function () {
        limitedIterator.index++;

        return listOfAllFriends[limitedIterator.index - 1] && maxLevel !== 0
            ? listOfAllFriends[limitedIterator.index - 1] : null;
    };

    return limitedIterator;
}

function getFriendsList(currentFriendList, listOfAllFriends) {
    for (let person of currentFriendList) {
        if (!listOfAllFriends.includes(person)) {
            listOfAllFriends.push(person);
        }
    }

    return listOfAllFriends;
}

function getVertex(friends, currentFriendList) {
    currentFriendList = friends.filter(fr => currentFriendList.includes(fr.name));

    return currentFriendList;
}

function getBestFriends(friends) {
    friends = friends.filter(person => person.best);

    return friends;
}

function getCircle(currentFriendList) {
    let result = [];
    for (let person of currentFriendList) {
        let currentRes = person.friends;
        result = result.concat(currentRes);
    }
    result.sort(compareForName);

    return result;
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isNecessary = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    const genderFilter = Object.create(new Filter());
    genderFilter.isNecessary =
            person => person.gender === 'male';

    return genderFilter;
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    const genderFilter = Object.create(new Filter());
    genderFilter.isNecessary =
            person => person.gender === 'female';

    return genderFilter;
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
