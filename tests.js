/* eslint-env mocha */
'use strict';

const assert = require('assert');

const lib = require('./lib');

const friendss = [
    {
        name: 'Sam',
        friends: ['Mat', 'Sharon'],
        gender: 'male',
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
        name: 'Sally',
        friends: ['Emily', 'Brad'],
        gender: 'female',
        best: true
    },
    {
        name: 'Julia',
        friends: ['Brad', 'Itan'],
        gender: 'female'
    }
];

class InitializeBFSCarcass {
    constructor(friends) {
        this.sortedFriend = sortFriend(friends);
        this.used = arrayWithZeros(friends.length);
        this.queue = takeBestFriends(this.sortedFriend);
        this.namesDict = {};

        for (let i = 0; i < this.sortedFriend.length; ++i) {
            this.namesDict[this.sortedFriend[i].name] = i;
        }

        for (let i = 0; i < this.queue.length; ++i) {
            this.used[i] = true;
        }
    }
}

function takeBestFriends(sortedFriend) {
    let result = [];
    for (let i = 0; i < sortedFriend.length && sortedFriend[i].best === true; ++i) {
        result.push(sortedFriend[i]);
    }

    return result;
}

function arrayWithZeros(size) {
    let result = [size];
    for (let i = 0; i < size; i++) {
        result[i] = 0;
    }

    return result;
}
function sortFriend(friends) {
    return friends.sort(function (a, b) {
        if (a.best && b.best) {
            return a.name.localeCompare(b.name);
        }

        return b.best;
    });
}

function* generateSequence(friends, filter, maxLevel) {
    let bfs = new InitializeBFSCarcass(friends);
    let level = 0;
    let nextLevel = [];
    function pushFriends(toFriend) {
        let friendId = bfs.namesDict[toFriend];
        if (!bfs.used[friendId]) {
            bfs.used[friendId] = true;
            nextLevel.push(bfs.sortedFriend[friendId]);
        }
    }

    while (bfs.queue.length > 0 && level < maxLevel) {
        nextLevel = [];
        for (let i = 0; i < bfs.queue.length; ++i) {
            bfs.queue[i].friends.forEach(pushFriends);
        }

        let filteringFriends = bfs.queue.filter(f => filter.it(f));
        for (let i = 0; i < filteringFriends.length; ++i) {
            yield filteringFriends[i];
        }

        bfs.queue = nextLevel.sort((a, b) => a.name.localeCompare(b.name));
        ++level;
    }

    return;
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.it = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.it = friend => friend.gender === 'male';
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.it = friend => friend.gender === 'female';
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;


const femaleFilter = new FemaleFilter();
const maleFilter = new MaleFilter();

var generator = generateSequence(friendss, maleFilter, 2);

console.info(new InitializeBFSCarcass(friendss));

console.info(generator.next());
console.info(generator.next());
console.info(generator.next());
console.info(generator.next());

