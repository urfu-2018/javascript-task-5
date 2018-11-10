'use strict';

function bestSort(array) {
    return array.sort((a, b) => {
        if (a.best === b.best) {
            return 0;
        } else if (a.best) {
            return -1;
        }

        return 1;
    });
}

function nameSort(array) {
    return array.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        }

        return 0;
    });
}

function pushUsed(maleFriends, invitedMales = []) {
    maleFriends.forEach(friend => {
        if (notInvited(friend, invitedMales)) {
            invitedMales.push(friend);
        }
    });

    return invitedMales;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    let allFemale = filter.prototype.getNeed(friends, filter.gender);
    let sortNameFemale = nameSort(allFemale);
    let resultSort = bestSort(sortNameFemale);

    console.info('sorted');
    console.info(resultSort);

    return resultSort;
}

function getFriends(friends, allFriends, uniqueFriends) {
    friends.forEach(friend => {
        allFriends.forEach(element => {
            if (element.name === friend) {
                uniqueFriends.push(element);
            }
        });
    });

    return uniqueFriends;
}

function notInvited(friend, invitedMales) {
    return invitedMales.every(male => {
        return friend.name !== male.name;
    });
}

function getBestFriends(friends, filter) {
    return filter.prototype.getBest(friends);
}

function getNextCircle(bestFriends, friends) {
    let uniqueFriends = [];
    bestFriends.forEach(bestFriend => {
        uniqueFriends = getFriends(bestFriend.friends, friends, uniqueFriends);
    });

    return uniqueFriends;
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
    if (maxLevel === 0) {
        return [];
    }
    let bestFriends = getBestFriends(friends, filter);
    let bestMale = nameSort(filter.prototype.getNeed(bestFriends, filter.gender));
    let invitedMales = pushUsed(bestMale);
    maxLevel--;
    let regularFriends = bestFriends; // для поиска друзей ЛД
    while (maxLevel !== 0) {
        regularFriends = getNextCircle(regularFriends, friends);
        let maleFriends = filter.prototype.getNeed(regularFriends, filter.gender);
        invitedMales = pushUsed(maleFriends, invitedMales);
        maxLevel--;
    }
    console.info('tyta');
    console.info(invitedMales);

    return invitedMales;
    // в конце отсортирую и усё
    // bestFriend.friends = nameSort(filter.prototype.getNeed(bestFriend.friends,
    // filter.gender));
    // сделал 1 и 2 круги дальше легче можно сделать рекурсию
    /* let circle = allMale.filter(element => {
        return !element.best;
    });*/
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = undefined;
    this.getBest = function (array) {
        const result = [];
        array.forEach(element => {
            if (element.best) {
                result.push(element);
            }
        });

        return result;
    };
    this.getNeed = function (array, gender) {
        if (!gender) {
            return array;
        }

        return array.filter(element => {
            return element.gender === gender;
        });
    };
    console.info('Filter');
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.gender = 'male';
    this.prototype = new Filter();
    console.info('MaleFilter');
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.gender = 'female';
    this.prototype = new Filter();
    console.info('FemaleFilter');
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
