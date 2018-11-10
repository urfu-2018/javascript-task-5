'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('azaazazazaza');
    }
    this.inv = createAPair(friends).filter(f => filter.filterOut(f));
    this.index = 0;
}

Iterator.prototype = {
    inv: [],
    index: 0,
    done() {
        return this.index >= this.inv.length;
    },
    next() {
        return this.done() ? null : this.inv[this.index++];
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
        throw new TypeError('azaazazazaza');
    }
    this.inv = createAPair(friends, maxLevel)
        .filter(f => filter.filterOut(f));
    this.index = 0;
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

function createAPair(friends, maxDepth = friends.length) {
    let depth = 0;
    let result = [];
    let addFriends = friends.filter(f => f.best);
    while (addFriends.length > 0 && depth < maxDepth) {
        let tmp = addFriends.sort((a, b) => a.name.localeCompare(b.name));
        result = result.concat(tmp);
        addFriends = friendsOfFriends(addFriends, result)
            .map(name => friends.find(friend => friend.name === name));
        depth++;
    }

    return result;
}

function friendsOfFriends(addFriends, listInvFriends) {
    let result = [];
    let listFriends = listInvFriends.map(f => f.name);
    for (var i = 0; i < addFriends.length; i++) {
        let tmp = addFriends[i].friends.filter(f => listFriends.indexOf(f) === -1);
        result.push(...tmp);
    }

    return result;
}


/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filterOut = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filterOut = (friend) => friend.gender === 'male';
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filterOut = (friend) => friend.gender === 'female';
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
