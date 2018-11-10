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

    // Контейнер для кругов друзей
    const friendLevels = [];

    // Первый круг - лучшие друзья
    const bestFriends = friends.filter((friend) => {
        return friend.best === true;
    });
    friendLevels.push(filterAndSortLevel(bestFriends, filter));

    // Остальные круги - друзья друзей из предыдущего круга
    for (let level of friendLevels) {
        const nextLevel = getNextLevel(level, friendLevels);
        const nextLevelFiltered = filterAndSortLevel(nextLevel, filter);
        if (nextLevelFiltered.length > 0) {
            friendLevels.push(nextLevelFiltered);
        }
    }

    // Индексы для итератора
    const nextElement = {
        level: 0,
        index: 0
    };

    this.getLevelIndex = function () {
        return nextElement.level;
    };

    this.done = function () {
        return nextElement.level === friendLevels.length;
    };

    this.next = function () {
        if (this.done()) {
            return null;
        }

        const result = friendLevels[nextElement.level][nextElement.index];

        // Продвинуть итератор на следующий элемент
        if (nextElement.index === friendLevels[nextElement.level].length - 1) {
            nextElement.level++;
            nextElement.index = 0;
        }

        return result;
    };
}

/*
 * Получить следующий круг друзей
 */
function getNextLevel(previousLevel, levelContainer) {

    const nextLevel = [];
    for (let friend of previousLevel) {
        // Вынесено в отдельную функцию ради снижения вложенности для линтера
        addFriendsOfAFriend(friend, nextLevel, levelContainer);
    }

    return nextLevel;
}

/*
 * Добавление в очередной круг друзей тех друзей заданного друга, которые ещё не были добавлены
 */
function addFriendsOfAFriend(friend, level, levelContainer) {
    for (let friendOfFriend of friend.friends) {
        if (!containsFriend(level, friendOfFriend) &&
            !friendAlreadyAdded(levelContainer, friendOfFriend)) {
            level.push(friendOfFriend);
        }
    }
}

/*
 * Привести круг друзей к виду, пригодному для включения в список кругов итератора
 */
function filterAndSortLevel(friends, filter) {
    return friends.filter(filter.isPassing).sort(compareFriendsByName);
}

/*
 * Проверить, был ли друг с таким именем добавлен в список итерации
 */
function friendAlreadyAdded(levelContainer, friend) {

    for (let level of levelContainer) {
        if (containsFriend(level, friend)) {
            return true;
        }
    }

    return false;
}

/*
 * Проверить, содержит ли некоторый контейнер запись о друге с таким именем
 */
function containsFriend(container, friend) {
    return container.some((existingFriend) => {
        return existingFriend.name === friend.name;
    });
}

/*
 * Сравнение друзей по имени в алфавитном порядке
 */
function compareFriendsByName(a, b) {

    if (a.name < b.name) {
        return -1;
    } else if (a.name > b.name) {
        return 1;
    }

    return 0;
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

    const parentIterator = new Iterator(friends, filter);

    return Object.create(parentIterator, {
        done: {
            value: function () {
                return parentIterator.done() || parentIterator.getLevelIndex() === maxLevel;
            }
        }
    });
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {

    // Функция, проверяющая, проходит ли друг через этот фильтр
    this.isPassing = function (friend) {
        return friend.name.length >= 0;
    };
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    return createGenderFilter('male');
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    return createGenderFilter('female');
}

/*
 * Создать фильтр по заданному полу друзей
 */
function createGenderFilter(gender) {
    return Object.create(new Filter(), {
        isPassing: {
            value: function (friend) {
                return friend.gender === gender;
            }
        }
    });
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
