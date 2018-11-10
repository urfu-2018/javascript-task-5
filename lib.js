'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel
 */
function Iterator(friends, filter, maxLevel = Infinity) {

    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    // Круги друзей, пригодных для итерации
    const iterationLevels = makeIterationLevels(friends, filter);

    // Счётчик, указывающий на следующий элемент итератора
    const nextElement = {
        level: 0,
        index: 0
    };

    // Функция для увеличения счётчика, указывающего на следующий элемент итератора
    function increaseCounter() {

        // Если достигли последнего друга в одном круге, продвинуться на следующий круг
        if (nextElement.index === iterationLevels[nextElement.level].length - 1) {

            /* Продвинуться до следующего уровня, в котором есть хотя бы один друг,
             * если такой существует */
            while (nextElement.level + 1 < iterationLevels.length &&
                iterationLevels[nextElement.level + 1].length === 0) {
                nextElement.level++;
            }
            nextElement.level++;

            nextElement.index = 0;
        } else {
            // Иначе увеличить индекс элемента в круге
            nextElement.index++;
        }
    }

    return {
        done() {
            return nextElement.level === iterationLevels.length || nextElement.level >= maxLevel;
        },
        next() {
            if (this.done()) {
                return null;
            }
            const result = iterationLevels[nextElement.level][nextElement.index];
            increaseCounter();

            return result;
        }
    };

}

/*
 * Создать список кругов друзей, пригодных для итерации
 */
function makeIterationLevels(friends, filter) {

    const iterationLevels = [];

    // Первый круг - лучшие друзья
    const bestFriends = friends.filter((friend) => {
        return friend.best === true;
    });
    iterationLevels.push(bestFriends);

    /* Далее первого круга даются лишь имена друзей,
     * поэтому создаём справочник друзей по именам */
    const friendsByName = new Map();
    friends.forEach((friend) => {
        friendsByName.set(friend.name, friend);
    });

    // В следующий кругах - друзья друзей из предыдущих кругов
    for (let i = 0; i < iterationLevels.length; i++) {
        const currentLevel = iterationLevels[i];
        const nextLevel = makeNextLevel(currentLevel, iterationLevels, friendsByName);
        if (nextLevel.length > 0) {
            iterationLevels.push(nextLevel);
        }
    }

    return iterationLevels.map((level) => {
        return level.filter(filter.isPassing).sort(compareFriendsByName);
    });
}

/*
 * Получить следующий круг друзей
 */
function makeNextLevel(previousLevel, levelContainer, friendsByName) {

    const nextLevel = [];
    previousLevel.forEach((friend) => {
        friend.friends.map((friendOfFriend) => {
            // Из имён друзей получаем записи о друзьях
            return friendsByName.get(friendOfFriend);
        }).forEach((friendOfFriend) => {
            // Добавляем только тех друзей, которые ещё не были добавлены
            if (!levelContainsFriend(nextLevel, friendOfFriend) &&
                !friendAlreadyAdded(levelContainer, friendOfFriend)) {
                nextLevel.push(friendOfFriend);
            }
        });
    });

    return nextLevel;
}

/*
 * Проверить, был ли некоторый друг уже добавлен в список итерации
 */
function friendAlreadyAdded(iterationLevels, friend) {
    return iterationLevels.some((existingLevel) => {
        return levelContainsFriend(existingLevel, friend);
    });
}

/*
 * Проверить, содержит ли круг запись о друге с таким же именем
 */
function levelContainsFriend(level, friend) {
    return level.some((existingFriend) => {
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
    return Object.create(new Iterator(friends, filter, maxLevel));
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {

    // Функция, проверяющая, проходит ли друг через этот фильтр
    this.isPassing = function (friend) {
        return typeof friend !== undefined;
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
