/* eslint-env mocha */
'use strict';

const assert = require('assert');

const lib = require('./lib');

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

describe('Фильтры', () => {
    it('Должен коректно фильтровать девушек', () => {
        const femaleFilter = new lib.FemaleFilter();

        const friendNames = friends
            .filter(femaleFilter.filterFunction)
            .map(friend => friend.name);

        assert.deepStrictEqual(friendNames, ['Sally', 'Sharon', 'Emily', 'Julia']);
    });

    it('Должен коректно фильтровать парней', () => {
        const femaleFilter = new lib.MaleFilter();

        const friendNames = friends
            .filter(femaleFilter.filterFunction)
            .map(friend => friend.name);

        assert.deepStrictEqual(friendNames, ['Sam', 'Mat', 'Brad', 'Itan']);
    });
});

describe('Итераторы', () => {

    it('Должен выбрасывать исключение когда передан не фильтр', () => {
        const notAFilter = 'is not a filter';

        assert.throws(() => new lib.Iterator(friends, notAFilter), TypeError);
        assert.throws(() => new lib.LimitedIterator(friends, notAFilter, 1), TypeError);
    });

    it('должны обойти в правильном порядке друзей и составить пары', () => {
        const maleFilter = new lib.MaleFilter();
        const femaleFilter = new lib.FemaleFilter();
        const maleIterator = new lib.LimitedIterator(friends, maleFilter, 2);
        const femaleIterator = new lib.Iterator(friends, femaleFilter);

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

        assert.deepStrictEqual(invitedFriends, [
            [friend('Sam'), friend('Sally')],
            [friend('Brad'), friend('Emily')],
            [friend('Mat'), friend('Sharon')],
            friend('Julia')
        ]);
    });

    function friend(name) {
        let len = friends.length;

        while (len--) {
            if (friends[len].name === name) {
                return friends[len];
            }
        }
    }
});
