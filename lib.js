'use strict';

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
    this.guests = getInvitedFriends(friends, filter);
    this.k = -1;
    this.done = () => {
        if (this.k === this.guests.length - 1 ||
            this.guests.length === 0) {
            return true;
        }

        return false;
    };
    this.next = () => {
        return this.done() ? null : this.guests[++(this.k)];
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
    Iterator.call(this, friends, filter);
    this.guests = getInvitedFriends(friends, filter, maxLevel);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
* Подготовка списка друзей, которых Билли пригласит на свадьбу.
* @param {Object[]} allPeople – список всех людей из блокнота Билли.
* @param {Filter} genderFilter – фильтр по полу.
* @param {Number} maxLevel – максимальный круг друзей, если не задан - смотрим всех.
* @returns {Object[]} – отсортированный список приглашаемых на свадьбу друзей.
*/
function getInvitedFriends(allPeople, genderFilter, maxLevel = Infinity) {
    let invitedFriends = [];
    const sortNames = (first, second) => first.name.localeCompare(second.name);
    let currentLevelFriends = allPeople.filter(friend => friend.best).sort(sortNames);
    while (maxLevel > 0 && currentLevelFriends.length > 0) {
        invitedFriends = invitedFriends.concat(currentLevelFriends);
        currentLevelFriends = getNextLevel(currentLevelFriends, allPeople, invitedFriends)
            .sort(sortNames);
        maxLevel--;
    }

    return invitedFriends.filter(genderFilter.weed);
}

/**
* Получение следующего круга друзей.
* @param {Object[]} curLevel – текущий круг приглашаемых друзей.
* @param {Object[]} originArray – изначальный список всех людей.
* @param {Number} accumulator – все те люди, которых мы уже "накопили" ранее.
* @returns {Object[]} – список следующего круга уникальных друзей.
*/
function getNextLevel(curLevel, originArray, accumulator) {
    const reducer = (newArr, person) => newArr.concat(person.friends);

    return Array.from(new Set(curLevel
        .reduce(reducer, [])))
        .map(each => originArray.find(person => each === person.name))
        .filter(person => !accumulator.includes(person));
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');

    this.weed = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');
}

MaleFilter.prototype = Object.create(Filter.prototype, {
    weed: {
        value: (friend) => friend.gender === 'male'
    }
});

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');
}

FemaleFilter.prototype = Object.create(Filter.prototype, {
    weed: {
        value: (friend) => friend.gender === 'female'
    }
});


exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
