'use strict';

function getChosenFriendsList(friends, circlesCount = 100000) {
    friends = friends.sort((x, y) => x.name.localeCompare(y.name));
    let currentCircle = friends.filter(f => f.best);
    let result = currentCircle;

    for (let i = 1; i < circlesCount && result.length < friends.length; i++) {
        let nextCircle = [];
        currentCircle.forEach(element => {
            element.friends.forEach(friendName => {
                const friendObj = friends.find(e => e.name === friendName);
                if (!result.includes(friendObj)) {
                    nextCircle.push(friendObj);
                    result.push(friendObj);
                }
            });
        });

        currentCircle = nextCircle.length ? nextCircle : friends.find(x => !result.includes(x));
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

    this.orderedFriends = getChosenFriendsList(friends).filter(filter.isSutable);
    this.next = () => this.orderedFriends.shift();
    this.done = () => this.orderedFriends.length === 0;
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
    this.orderedFriends = getChosenFriendsList(friends, maxLevel).filter(filter.isSutable);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isSutable = function () {
        return Boolean;
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    const maleFilter = Object.create(Filter.prototype);
    maleFilter.isSutable = friend => friend.gender === 'male';

    return maleFilter;
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    const femaleFilter = Object.create(Filter.prototype);
    femaleFilter.isSutable = friend => friend.gender === 'female';

    return femaleFilter;
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
