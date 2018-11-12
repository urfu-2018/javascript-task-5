'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!filter instanceof Filter) {
        throw new TypeError();
    }
    this.weddingGuests = getInvitedFriends(friends, filter);
    this.index = 0;
    this.done = () => {
        return index >= this.weddingGuests.length; 
    };
    this.next = () => {
        if (this.done) {
            return null;
        } else {
            return this.weddingGuests[this.index++];
        }
    };
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);
Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);


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
    return this.isSuitable = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.isSuitable = (friend) => friend.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.isSuitable = (friend) => friend.gender === 'female';
}

/**
 * Получение списка друзей, которые будут приглашены на свадьбу
 * @param {Object[]} AllFriends - список всех друзей
 * @param {Filter} filter
 * @param {Number} maxLevel - максимальный круг друзей
 * @returns {Object[]} - отсортированный массив,
 * кого Аркадий пригласит на свадьбу
 */
function getInvitedFriends(friends, filter, maxLevel = Infinity) {
    let  invited = [];
    let currentLevelList = friends.filter(friend => friend.best)
        .sort((a,b) => a.name.localeCompare(b.name));
    while (maxLevel > 0 && currentLevelList.length > 0) {
        invited = invited.concat(currentLevelList);
        currentLevelList = getNextLefelFriends(currentLevelList, invited, friends);
        maxLevel--;
    }

    return invited.filter(filter);
}

function getNextLefelFriends(currentLevelList, invited, friends)
{
    let nextLevelFriends = [];
    let invitedFriendsNames = invited.map(friend => friend.name);
    nextLevelFriends.concat(currentLevelList.forEach(friend => {
        friend.friends.filter(candidat =>
            invitedFriendsNames.indexOf(candidat) === -1)
    }));

    return friends.filter(friend => nextLevelFriends.includes(friend.name));
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
