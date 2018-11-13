'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter))
    {
        throw new TypeError();
    }
    this.friends = getSomeFriends(friends, filter);
    this.position = 0;
}

Iterator.prototype.done = function() {
    return this.position === this.friends.length;
}

Iterator.prototype.next = function() {
    if (this.done) {
        return null;
    }

    return this.friends.shift();
}
function nextFriendLevel() {
    let newLevel = [];
    
}

function alphabeticalSort(firstPerson, secondPerson) {
    return firstPerson.name.localeCompare(secondPerson.name);
}
function getBest(friends) {
    let bestFriends = friends.filter(friend => friend.best).sort(alphabeticalSort);

    return bestFriends;
}


function getSomeFriends(friends, filter, maxLevel = Infinity) {
    if (!friends || maxLevel <= 0 || !maxLevel) {
        return [];
    }
    let bestFriends = getBest(friends);
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
    console.info(friends, filter, maxLevel);
    if (!(filter instanceof Filter))
    {
        throw new TypeError();
    }
    this.friends = getSomeFriends(friends, filter, maxLevel);
    this.position = 0;
}
LimitedIterator.prototype = Object.create(Iterator.prototype)
/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = '';
}


Filter.prototype = function filtGender(friends) {
    if(this.gender === friends.gender || this.gender === '') {
        return true;
    }

    return false;
}
/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    //console.info('MaleFilter');
    this.gender = 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);
/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    //console.info('FemaleFilter');
    this.gender = 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
