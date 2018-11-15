'use strict';


/**
 * Сравнение двух имен друзей лексикографически
 * @param {Object} friend1 - Первый друг с параметром name
 * @param {Object} friend2 - Второй друг с параметром name
 * @returns {Function} - Функция сравнения
 */
function nameLocalCompare(friend1, friend2) {
    return friend1.name.localeCompare(friend2.name);
}

/**
 * Получает список гостей для приглашения на свадьбу
 * @param {Object[]} friends - Массив друзей Аркандия
 * @param {Number} maxLevel - Максимальный круг друзей
 * @returns {Object[]} - Массив друзей для приглашение
 */
function getListOfGuests(friends, maxLevel = Infinity) {
    let currentLevelList = friends.filter(friend => friend.best)
        .sort(nameLocalCompare);

    const guestsList = [];

    while (currentLevelList.length > 0 && maxLevel > 0) {
        guestsList.push(...currentLevelList);
        currentLevelList = currentLevelList.reduce((acc, friend) => {
            friend.friends.map(friendName => friends.find(man => man.name === friendName))
                .filter(friendObject => !guestsList.includes(friendObject) &&
                !acc.includes(friendObject))
                .forEach(guest => acc.push(guest));

            return acc;
        }, []).sort(nameLocalCompare);
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
    if (!(filter instanceof Filter)) {
        throw new TypeError('Passed filter is not instance of Filter');
    }

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
