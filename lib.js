'use strict';

const proto = {
    inv: [],
    index: 0,
    done() {
        return this.index >= this.inv.length;
    },
    next() {
        return this.done() ? null : this.inv[this.index++];
    }
};

Object.setPrototypeOf(Iterator.prototype, proto);
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
    console.info(friends, filter);
    if (!(filter instanceof Filter)) {
        throw new TypeError('azaazazazaza');
    }
    this.inv = createAPair(friends).filter(f => filter.filterOut(f));
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
    console.info(friends, filter, maxLevel);
    this.inv = createAPair(friends, maxLevel)
        .filter(f => filter.filterOut(f));
}

function createAPair(friends, maxDepth = friends.length) {
    var depth = 1;
    var result = [];
    var addFriends = friends.filter(f => f.best);
    while (addFriends.length > 0 && depth++ <= maxDepth) {
        result = result.concat(addFriends.sort((a, b) => a.name
            .localeCompare(b.name)));
        addFriends = friendsOfFriends(addFriends, result)
            .map(name => friends.find(friend => friend.name === name));
    }

    return result;
}

function friendsOfFriends(addFriends, listInvFriends) {
    var result = [];
    var listFriends = listInvFriends.map(f => f.name);
    for (var i = 0; i < addFriends.length; i++) {
        result.push(...addFriends[i].friends.filter(f => !listFriends.includes(f)));
    }

    return result;
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');
    this.filterOut = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');
    this.filterOut = (friend) => friend.gender === 'male';
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');
    this.filterOut = (friend) => friend.gender === 'female';
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
