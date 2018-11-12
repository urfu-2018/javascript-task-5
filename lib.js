'use strict';

function formGuestList(friends, maxLevel = Infinity) {
    let currentGuestsList = friends.filter(friend => {
        return friend.best;
    }).sort((firstFriend, secondFriend) => {
        return firstFriend.name.localeCompare(secondFriend.name);
    });

    const finalGuestsList = [];

    while (currentGuestsList.length > 0 && maxLevel > 0) {
        finalGuestsList.push(...currentGuestsList);
        currentGuestsList = currentGuestsList.reduce((acc, friend) => {
            friend.friends.forEach(friendName => {
                const newFriend = friends.find(person => person.name === friendName);
                if (!finalGuestsList.includes(newFriend) && !acc.includes(newFriend)) {
                    acc.push(newFriend);
                }
            });

            return acc;
        }, []).sort((friend1, friend2) => friend1.name.localeCompare(friend2.name));
        maxLevel--;
    }

    return finalGuestsList;
}

Iterator.prototype = {
    guestsList: [],
    currentIndex: 0,
    done() {
        return this.currentIndex >= this.guestsList.length;
    },
    next() {
        if (!(this.done())) {
            return this.guestsList[this.currentIndex++];
        }

        return null;
    }
};

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    this.currentIndex = 0;
    this.guestsList = formGuestList(friends).filter(friend => {
        return filter.isOkCondition(friend);
    });
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
    this.currentIndex = 0;
    this.guestsList = formGuestList(friends, maxLevel).filter(freind => {
        return filter.isOkCondition(freind);
    });
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

Filter.prototype = {
    isOkCondition() {
        return true;
    }
};

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isOkCondition = () => {
        return true;
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isOkCondition = (friend) => {
        return friend.gender === 'male';
    };
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isOkCondition = (friend) => {
        return friend.gender === 'female';
    };
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
