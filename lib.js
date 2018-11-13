'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('Invalid type of filter!');
    }
    this.guests = getInvitedGuests(friends).filter(filter.checkGender);
}
Iterator.prototype.next = function () {
    if (this.done()) {
        return null;
    }

    return this.guests.shift();
};

Iterator.prototype.done = function () {
    return this.guests.length === 0;
};

/**
 * @param {Array} friends - friend {Object}
 * @param {Number} maxLevel
 * @returns {Array}
 */
function getInvitedGuests(friends, maxLevel = Infinity) {
    let guests = [];
    let curLevel = friends
        .filter(friend => friend.best)
        .sort((fr1, fr2) => fr1.name.localeCompare(fr2.name));
    while (curLevel.length > 0 && maxLevel > 0) {
        guests.concat(guests, curLevel);
        curLevel = curLevel
            .reduce((newLevel, friend) => {
                friend.friends.forEach(friendName => {
                    const newFriend = friends.find(man => man.name === friendName);
                    if (!guests.includes(newFriend) && !newLevel.includes(newFriend)) {
                        newLevel.push(newFriend);
                    }

                });

                return newLevel;
            }, [])
            .sort((fr1, fr2) => fr1.name.localeCompare(fr2.name));
        maxLevel--;
    }

    return guests;
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
    this.guests = getInvitedGuests(friends, maxLevel).filter(filter.checkGender);
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.checkGender = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.checkGender = friend => friend.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.checkGender = friend => friend.gender === 'female';
}

LimitedIterator.prototype = Object.create(Iterator.prototype, {
    constructor: { value: LimitedIterator }
});

MaleFilter.prototype = Object.create(Filter.prototype, {
    constructor: { value: MaleFilter }
});

FemaleFilter.prototype = Object.create(Filter.prototype, {
    constructor: { value: FemaleFilter }
});

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
