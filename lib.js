'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('Объект фильтра не является инстансом функции-конструктора Filter');
    }

    this.guests = this.createGuestsList(friends, filter);
    this.currentGuest = 0;
}

Iterator.prototype.done = function () {
    return this.currentGuest === this.guests.length;
};

Iterator.prototype.next = function () {
    return this.done() ? null : this.guests[this.currentGuest++];
};

Iterator.prototype.createGuestsList = function (friends, filter, maxLevel = Infinity) {
    const friendsNameComparator = (a, b) => a.name.localeCompare(b.name);

    let currentLevelGuests = friends
        .filter(friend => friend.best)
        .sort(friendsNameComparator);
    const guests = currentLevelGuests;

    while (maxLevel - 1 && currentLevelGuests.length) {
        const nextLevelGuestsNames = [];
        for (const invitedFriend of currentLevelGuests) {
            nextLevelGuestsNames.push(...invitedFriend.friends);
        }

        currentLevelGuests = friends
            .filter(friend => nextLevelGuestsNames
                .filter((i, pos, arr) => arr.indexOf(i) === pos)
                .includes(friend.name))
            .filter(friend => !guests.includes(friend))
            .sort(friendsNameComparator);
        guests.push(...currentLevelGuests);

        maxLevel--;
    }

    return guests.filter(filter.checkFriend);
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
    if (!(filter instanceof Filter)) {
        throw new TypeError('Объект фильтра не является инстансом функции-конструктора Filter');
    }

    this.guests = this.createGuestsList(friends, filter, maxLevel);
    this.currentGuest = 0;
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    // eslint-disable-line no-empty
}

Filter.prototype.checkFriend = () => true;

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    // eslint-disable-line no-empty
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;
MaleFilter.prototype.checkFriend = friend => friend.gender === 'male';

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    // eslint-disable-line no-empty
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;
FemaleFilter.prototype.checkFriend = friend => friend.gender === 'female';

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
