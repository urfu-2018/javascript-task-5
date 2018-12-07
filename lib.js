'use strict';

/**
 * Сравнение для имён
 * @constructor
 * @param {Object} name1
 * @param {Object} name2
 * @returns {number}
 */
function compareForName(name1, name2) {
    let result = 0;
    if (name1.name < name2.name) {
        result = -1;
    }
    if (name1.name > name2.name) {
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
    friends.sort(compareForName); // нужные в алфавитном порядке
    let currentFriendList = getBestFriends(friends); // список имен
    let listOfAllInvited = currentFriendList; // пока взяли только лучших друзей
    listOfAllInvited = getInvitedFriends(currentFriendList, friends, listOfAllInvited);
    listOfAllInvited = listOfAllInvited.filter(fr => filter.isNecessary(fr)); // фильтр по полу
    this.index = 0;
    this.done = function () {
        return this.index >= listOfAllInvited.length;
    };
    this.next = function () {
        this.index++;

        return listOfAllInvited[this.index - 1] ? listOfAllInvited[this.index - 1] : null;
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
    let listOfAllInvited = currentFriendList;
    listOfAllInvited = getInvitedFriends(currentFriendList, friends, listOfAllInvited, maxLevel);
    listOfAllInvited = listOfAllInvited.filter(fr => filter.isNecessary(fr));
    limitedIterator.done = function () {
        return limitedIterator.index >= listOfAllInvited.length || maxLevel <= 0;
    };
    limitedIterator.next = function () {
        if (limitedIterator.done()) {
            return null;
        }
        limitedIterator.index++;

        return (listOfAllInvited[limitedIterator.index - 1] && maxLevel > 0)
            ? listOfAllInvited[limitedIterator.index - 1] : null;
    };

    return limitedIterator;
}

function getInvitedFriends(currentFriendList, friends, listOfAllFriends, maxLevel = Infinity) {
    for (let i = 1; i < maxLevel; i++) {
        currentFriendList = getCircle(currentFriendList);
        currentFriendList = getGraph(friends, currentFriendList);
        let currentListOfAllFriends = getFriendsList(currentFriendList, listOfAllFriends);
        if (!currentListOfAllFriends) {
            break;
        }
        listOfAllFriends = currentListOfAllFriends;
    }

    return listOfAllFriends;
}

function getFriendsList(currentFriendList, listOfAllFriends) {
    let flag = false;
    for (let person of currentFriendList) {
        if (!listOfAllFriends.includes(person)) {
            listOfAllFriends.push(person);
            flag = true;
        }
    }
    if (!flag) {
        return null;
    }

    return listOfAllFriends;
}

function getGraph(friends, currentFriendList) {
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
        result = result.concat(person.friends);
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
