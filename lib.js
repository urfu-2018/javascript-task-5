'use strict';

Iterator.prototype = {

    /**
     * Получение друзей следующего уровня
     * @param {Object[]} currentLevelList - список друзей текущего уровня
     * @param {Object[]} invited - уже приглашенные на текущий момент
     * @param {Object[]} friends - все друзья
     * @returns {Object[]} - отсортированный массив друзей следующего уровня
     */
    getNextLevelFriends(currentLevelList, invited, friends) {
        let nextLevelFriends = [];
        let FriendsNames = currentLevelList.reduce((prev, friend) => {
            return prev.concat(friend.friends);
        }, []);
        const notAllFriends = FriendsNames.map(name => {
            return friends.find(friend => name === friend.name);
        });
        let index = 0;
        nextLevelFriends = notAllFriends.filter(candidat =>
            !invited.includes(candidat));
        nextLevelFriends = nextLevelFriends.filter(candidat =>
            nextLevelFriends.indexOf(candidat) === index++);

        return nextLevelFriends.sort((a, b) => a.name.localeCompare(b.name));
    },

    /**
     * Получение списка друзей, которые будут приглашены на свадьбу
     * @param {Object[]} friends - список всех друзей
     * @param {Number} maxLevel - максимальный круг друзей
     * @returns {Object[]} - отсортированный массив,
     * кого Аркадий пригласит на свадьбу
     */
    getInvitedFriends(friends, maxLevel = Infinity) {
        let invited = [];
        let currentLevelList = friends.filter(friend => friend.best)
            .sort((a, b) => a.name.localeCompare(b.name));
        if (currentLevelList.length === 0 || maxLevel < 1) {
            return invited;
        }
        invited = invited.concat(currentLevelList);
        while (maxLevel > 1 && currentLevelList.length > 0) {
            currentLevelList = this.getNextLevelFriends(currentLevelList, invited, friends);
            if (currentLevelList.length === 0) {
                break;
            }
            maxLevel--;
            invited = invited.concat(currentLevelList);
        }

        return invited;
    }
};

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);
Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

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
    this.weddingGuests = this.getInvitedFriends(friends)
        .filter(friend => filter.isSuitable(friend));
    this.index = 0;
    this.done = () => {
        return this.index >= this.weddingGuests.length;
    };
    this.next = () => {
        if (this.done()) {
            return null;
        }

        return this.weddingGuests[this.index++];
    };
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
    Iterator.apply(this, [friends, filter]);
    this.weddingGuests = this.getInvitedFriends(friends, maxLevel)
        .filter(friend => filter.isSuitable(friend));
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.isSuitable = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isSuitable = function (friend) {
        return friend.gender === 'male';
    };
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isSuitable = function (friend) {
        return friend.gender === 'female';
    };
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
