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

    // Круги друзей
    const iterationLevels = makeIterationLevels(friends, filter);

    // Индексы для итератора
    const nextElement = {
        level: 0,
        index: 0
    };

    this.getLevelIndex = function () {
        return nextElement.level;
    };

    this.done = function () {
        return nextElement.level === iterationLevels.length;
    };

    this.next = function () {
        if (this.done()) {
            return null;
        }

        const result = iterationLevels[nextElement.level][nextElement.index];

        // Продвинуть итератор на следующий элемент
        if (nextElement.index === iterationLevels[nextElement.level].length - 1) {
            nextElement.level++;
            nextElement.index = 0;
        }

        return result;
    };
}

function makeIterationLevels(friends, filter) {

    const iterationLevels = [];

    // Первый круг - лучшие друзья
    const bestFriends = friends.filter((friend) => {
        return friend.best === true;
    });
    iterationLevels.push(filterAndSortLevel(bestFriends, filter));

    /* Далее первого круга даются лишь имена друзей,
     * поэтому создаём справочник друзей по именам
     */
    const friendsByName = new Map();
    friends.forEach((friend) => {
        friendsByName.set(friend.name, friend);
    });

    // Остальные круги - друзья друзей из предыдущего круга
    iterationLevels.forEach((level) => {
        const nextLevel = getNextLevel(level, iterationLevels, friendsByName);
        const nextLevelFiltered = filterAndSortLevel(nextLevel, filter);
        if (nextLevelFiltered.length > 0) {
            iterationLevels.push(nextLevelFiltered);
        }
    });

    return iterationLevels;
}

/*
 * Привести круг друзей к виду, пригодному для включения в список кругов итератора
 */
function filterAndSortLevel(friends, filter) {
    return friends.filter(filter.isPassing).sort(compareFriendsByName);
}

/*
 * Получить следующий круг друзей
 */
function getNextLevel(previousLevel, levelContainer, friendsByName) {

    const nextLevel = [];
    previousLevel.forEach((friend) => {
        friend.friends.map((friendOfFriend) => {
            // Из имён друзей получаем записи о друзьях
            return friendsByName.get(friendOfFriend);
        }).forEach((friendOfFriend) => {
            // Добавляем только тех друзей, которые ещё не были добавлены
            if (!friendAlreadyAdded(friendOfFriend, nextLevel, levelContainer)) {
                nextLevel.push(friendOfFriend);
            }
        });
    });

    return nextLevel;
}

/*
 * Проверить, был ли некоторый друг уже добалвен
 */
function friendAlreadyAdded(friend, level, levelContainer) {
    return containsFriend(level, friend) ||
        levelContainer.some(containsFriend.bind(null, levelContainer, friend));
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
