'use strict';

const ascNames = (first, second) =>
    first.name.localeCompare(second.name);

const getBestFriends = (friends) => friends
    .filter(friend => friend.best)
    .sort(ascNames);

const getFriendsOf = (selected, all) => selected
    .reduce((acc, friend) => acc.concat(friend.friends), [])
    .map(name => all.find(friend => friend.name === name))
    .filter((friend, i, arr) => !selected.includes(friend) && arr.indexOf(friend) === i)
    .sort(ascNames);

function getLevels(invited, friends, maxLevel) {
    for (let level = 1; level < maxLevel; level++) {
        let friendsOfFriends = getFriendsOf(invited, friends);
        if (!friendsOfFriends.length) {
            break;
        }
        invited = invited.concat(friendsOfFriends);
    }

    return invited;
}

function getInvitedFriends(friends, filter, maxLevel = Infinity) {
    if (!friends || !filter || !maxLevel || maxLevel < 1) {
        return [];
    }

    return getLevels(getBestFriends(friends), friends, maxLevel)
        .filter(filter.predicate);
}

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
    this.invitedFriends = getInvitedFriends(friends, filter, this.maxLevel);
    this.index = 0;
    this.done = () => this.index >= this.invitedFriends.length;
    this.next = () => this.done() ? null : this.invitedFriends[this.index++];
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
    this.maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.call = this.predicate;
    this.predicate = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    Filter.call(this);
    this.predicate = person => person.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Filter.call(this);
    this.predicate = person => person.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;

const friends = [
    {
        name: 'Sam',
        friends: ['Mat', 'Sharon'],
        gender: 'male',
        best: true
    },
    {
        name: 'Sally',
        friends: ['Brad', 'Emily'],
        gender: 'female',
        best: true
    },
    {
        name: 'Mat',
        friends: ['Sam', 'Sharon'],
        gender: 'male'
    },
    {
        name: 'Sharon',
        friends: ['Sam', 'Itan', 'Mat'],
        gender: 'female'
    },
    {
        name: 'Brad',
        friends: ['Sally', 'Emily', 'Julia'],
        gender: 'male'
    },
    {
        name: 'Emily',
        friends: ['Sally', 'Brad'],
        gender: 'female'
    },
    {
        name: 'Itan',
        friends: ['Sharon', 'Julia'],
        gender: 'male'
    },
    {
        name: 'Julia',
        friends: ['Brad', 'Itan'],
        gender: 'female'
    }
];

const maleFilter = new MaleFilter();
const femaleFilter = new FemaleFilter();
const maleIterator = new LimitedIterator(friends, maleFilter, 2);
const femaleIterator = new Iterator(friends, femaleFilter);

const invitedFriends = [];

while (!maleIterator.done() && !femaleIterator.done()) {
    invitedFriends.push([
        maleIterator.next(),
        femaleIterator.next()
    ]);
}

while (!femaleIterator.done()) {
    invitedFriends.push(femaleIterator.next());
}
