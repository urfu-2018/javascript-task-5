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
    },
    {
        name: 'Melisa',
        friends: [],
        gender: 'female'
    }
];

describe('Итераторы', () => {
    it('должны обойти в правильном порядке друзей и составить пары', () => {
        const maleFilter = new lib.MaleFilter();
        const femaleFilter = new lib.FemaleFilter();
        const maleIterator = new lib.LimitedIterator(friends, maleFilter, 2);
        const femaleIterator = new lib.Iterator(friends, femaleFilter);

        console.info(
            'TEST ITSELF, CREATED ITERATORS: ',
            maleIterator.data.map(f => f.name), femaleIterator.data.map(f => f.name));

        const invitedFriends = [];

        while (!maleIterator.done() && !femaleIterator.done()) {
            invitedFriends.push([
                maleIterator.next().name,
                femaleIterator.next().name
            ]);
        }

        while (!femaleIterator.done()) {
            invitedFriends.push(femaleIterator.next().name);
        }

        const toName = fr => fr.name;

        assert.deepStrictEqual(invitedFriends, [
            [friend('Sam'), friend('Sally')].map(toName),
            [friend('Brad'), friend('Emily')].map(toName),
            [friend('Mat'), friend('Sharon')].map(toName),
            toName(friend('Julia')),
            toName(friend('Melisa'))
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

describe('Filters', () => {
    it('simple filter should not filter', () => {
        const filter = new lib.Filter();

        assert.deepStrictEqual(filter.exec({}), true);
        assert.deepStrictEqual(filter.exec({ gender: 'female' }), true);
    });

    it('male filter should filter out females', () => {
        const filter = new lib.MaleFilter();

        assert.deepStrictEqual(filter instanceof lib.Filter, true);

        assert.deepStrictEqual(filter.exec({}), false);
        assert.deepStrictEqual(filter.exec({ gender: 'male' }), true);
        assert.deepStrictEqual(filter.exec({ gender: 'female' }), false);
    });

    it('female filter should filter out males', () => {
        const filter = new lib.FemaleFilter();

        assert.deepStrictEqual(filter instanceof lib.Filter, true);

        assert.deepStrictEqual(filter.exec({}), false);
        assert.deepStrictEqual(filter.exec({ gender: 'male' }), false);
        assert.deepStrictEqual(filter.exec({ gender: 'female' }), true);
    });
});
