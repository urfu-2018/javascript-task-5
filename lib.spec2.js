/* eslint-env mocha */
'use strict';

const assert = require('assert');

const lib = require('./lib');

const friends = [
    {
        name: 'Sam',
        friends: ['Mat'],
        gender: 'female',
        best: true
    },
    {
        name: 'Mat',
        friends: ['Mat1'],
        gender: 'female'
    },
    {
        name: 'Mat1',
        friends: ['Mat2'],
        gender: 'female'
    },
    {
        name: 'Mat2',
        friends: ['Mat3'],
        gender: 'female'
    },
    {
        name: 'Mat3',
        friends: ['Mat4'],
        gender: 'female'
    },
    {
        name: 'Mat4',
        friends: ['Sam'],
        gender: 'female'
    }
];

describe('Итераторы', () => {
    it('должны обойти в правильном порядке друзей и составить пары', () => {
        const maleFilter = new lib.MaleFilter();
        const femaleFilter = new lib.FemaleFilter();
        const maleIterator = new lib.LimitedIterator(friends, maleFilter, 10);
        const femaleIterator = new lib.LimitedIterator(friends, femaleFilter, 6);

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
            friend('Sam'),
            friend('Mat'),
            friend('Mat1'),
            friend('Mat2'),
            friend('Mat3'),
            friend('Mat4')
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
