'use strict';


function getListOfGuests(friends, maxLevel = Infinity) {
    let currentLevelList = friends.filter(friend => friend.best)
        .sort((friend1, friend2) => friend1.name.localeCompare(friend2.name));

    const guestsList = [];

    while (currentLevelList.length > 0 && maxLevel > 0) {
        guestsList.push(...currentLevelList);
        currentLevelList = currentLevelList.reduce((acc, friend) => {
            friend.friends.forEach(friendName => {
                const newFriend = friends.find(man => man.name === friendName);
                if (!guestsList.includes(newFriend) && !acc.includes(newFriend)) {
                    acc.push(newFriend);
                }
            });

            return acc;
        }, []).sort((friend1, friend2) => friend1.name.localeCompare(friend2.name));
        maxLevel--;
    }

    return guestsList;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('Passed filter is not instance of Filter');
    }

    this.guests = getListOfGuests(friends).filter(filter.isFriendSuit);
}

Iterator.prototype = {
    done() {
        return this.guests.length === 0;
    },
    next() {
        return this.done() ? null : this.guests.shift();
    }
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
    this.guests = getListOfGuests(friends, maxLevel).filter(filter.isFriendSuit);
}

LimitedIterator.prototype = Object.create(Iterator.prototype, {
    constructor: { value: LimitedIterator }
});

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isFriendSuit = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isFriendSuit = friend => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype, {
    constructor: { value: MaleFilter }
});

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isFriendSuit = friend => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype, {
    constructor: { value: FemaleFilter }
});

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
