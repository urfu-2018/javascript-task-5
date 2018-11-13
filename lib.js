'use strict';

Iterator.prototype = {
    weddingGuests: [],
    index: 0,
    done() {
        return this.index >= this.weddingGuests.length;
    },
    next() {
        if (this.done()) {
            return null;
        }

        return this.weddingGuests[this.index++];
    }
};

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
    this.weddingGuests = getInvitedFriends(friends, filter)
        .filter(friend => filter.isSuitable(friend));
    this.index = 0;
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);
Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    this.weddingGuests = getInvitedFriends(friends, filter, maxLevel);
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

/**
 * Получение списка друзей, которые будут приглашены на свадьбу
 * @param {Object[]} friends - список всех друзей
 * @param {Filter} filter
 * @param {Number} maxLevel - максимальный круг друзей
 * @returns {Object[]} - отсортированный массив,
 * кого Аркадий пригласит на свадьбу
 */
function getInvitedFriends(friends, filter, maxLevel = Infinity) {
    let invited = [];
    let currentLevelList = friends.filter(friend => friend.best)
        .sort((a, b) => a.name.localeCompare(b.name));
    invited = invited.concat(currentLevelList);
    while (maxLevel > 0 && currentLevelList.length > 0) {
        currentLevelList = getNextLefelFriends(currentLevelList, invited, friends);
        if (currentLevelList.length === 0) {
            break;
        }
        maxLevel--;
        invited = invited.concat(currentLevelList);
    }

    return invited;
}

function getNextLefelFriends(currentLevelList, invited, friends) {
    let nextLevelFriends = [];
    let invitedFriendsNames = invited.map(friend => friend.name);
    nextLevelFriends = nextLevelFriends.concat(currentLevelList
        .forEach(friend => {
            friend.friends.filter(candidat =>
                invitedFriendsNames.indexOf(candidat) === -1);
        }));

    return friends.filter(friend => nextLevelFriends.includes(friend.name));
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
