'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('фильтр не Фильтр');
    }

    this.friends = friends;
    this.filter = filter;
    this.friendsInRightOrder = this.formatFriends(this.maxLevel);
}

Iterator.prototype = {

    /**
     * приводит массив друзей к упорядоченному списку
     * @param {Number} maxLevel
     * @returns {String[]}
     */
    formatFriends(maxLevel = this.friends.length) {
        if (maxLevel < 0) {
            return [];// если максимальный круг < 0, то Аркадий никого не хочет видеть))
        }
        const sortByName = (friend1, friend2) => friend1.name.localeCompare(friend2.name);
        // функция сортировки по имени
        let previousFront = this.friends.filter(friend => friend.best).sort(sortByName);
        // из предыдущего фронта дальше будут браться друзья друзей, а начальный список - лучшие
        let result = new Set(previousFront);// сразу положим лучших в результат
        // конструкция set позволит хранить друзей без повторений
        let front = 0;
        // фронт(круг) друзей
        while (front < maxLevel && previousFront.length > 0) {
            // если фронт дошел до максимального уровня, либо неоткуда брать друзей, то завершить
            let currentFront = [];// здесь будут храниться и позже сортироваться друзья друзей

            previousFront.forEach(friend => {
                friend.friends.forEach(bro => {
                    const friendToInvite = this.friends.find(guy => guy.name === bro);
                    // поиск друга из списка друзей по имени в общем списке друзей
                    currentFront.push(friendToInvite);
                });
            });

            currentFront.sort(sortByName).forEach(friend => result.add(friend));
            // сортированный список новых друзей закинуть в итоговый список
            if (currentFront.length === 0) {
                this.friends.sort(sortByName).forEach(friend => result.add(friend));

                /* если друзья не нашлись, то связи закончились и можно добавить вообще всех друзей,
                 а Set отсечет повторения*/
            }

            previousFront = currentFront;
            // из найденных друзей на следующем шаге будем искать других друзей
            front++;
        }

        return Array.from(result).filter(friend => this.filter.gender(friend));
        // преобразовал к массиву для упрощенной работы в методах done() и next()

    },
    done() {
        return this.friendsInRightOrder.length === 0;
    },

    next() {
        return (this.friendsInRightOrder.length === 0) ? null : this.friendsInRightOrder.shift();
        // тут все просто
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
    this.maxLevel = maxLevel - 1;// т.к. отсчет с 0, то границу тоже надо опустить
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.gender = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.gender = friend => friend.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.gender = friend => friend.gender === 'female';
}


MaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
