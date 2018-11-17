/* eslint-env mocha */
/* eslint-disable */
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

describe('Итераторы', () => {
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

const friends2 = [
    {
        name: 'Sam',
        friends: ['Mat', 'Sharon'],
        gender: 'male',
        best: true
    }
];

describe('Один парень', () => {
    it('один парень не пригласится', () => {
        const maleFilter = new lib.MaleFilter();
        const femaleFilter = new lib.FemaleFilter();
        const maleIterator = new lib.LimitedIterator(friends2, maleFilter, 2);
        const femaleIterator = new lib.Iterator(friends2, femaleFilter);

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

        assert.deepStrictEqual(invitedFriends, []);
    });
});



const friends3 = [
    {
        name: 'Sally',
        friends: ['Mat', 'Sharon'],
        gender: 'female',
        best: true
    }
];

describe('Одна девушка', () => {
    it('Пригласится', () => {
        const maleFilter = new lib.MaleFilter();
        const femaleFilter = new lib.FemaleFilter();
        const maleIterator = new lib.LimitedIterator(friends3, maleFilter, 2);
        const femaleIterator = new lib.Iterator(friends3, femaleFilter);

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

        assert.deepStrictEqual(invitedFriends, [friend('Sally')]);
    });

    function friend(name) {
        let len = friends3.length;

        while (len--) {
            if (friends3[len].name === name) {
                return friends3[len];
            }
        }
    }
});

const friends4 = [
];

describe('Никто', () => {
    it('Не крашнет прогу', () => {
        const maleFilter = new lib.MaleFilter();
        const femaleFilter = new lib.FemaleFilter();
        const maleIterator = new lib.LimitedIterator(friends4, maleFilter, 2);
        const femaleIterator = new lib.Iterator(friends4, femaleFilter);

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

        assert.deepStrictEqual(invitedFriends, []);
    });
});

const friends5 = [
    {
        name: 'Sam',
        friends: ['Mat', 'Sharon'],
        gender: 'male',
    },
    {
        name: 'Sally',
        friends: ['Brad', 'Emily'],
        gender: 'female',
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

describe('Нет лучших друзей', () => {
    it('никто не прийдет', () => {
        const maleFilter = new lib.MaleFilter();
        const femaleFilter = new lib.FemaleFilter();
        const maleIterator = new lib.LimitedIterator(friends5, maleFilter, 2);
        const femaleIterator = new lib.Iterator(friends5, femaleFilter);

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
        ]);

        function friend(name) {
            let len = friends5.length;

            while (len--) {
                if (friends5[len].name === name) {
                    return friends5[len];
                }
            }
        }
    });
});

const friends6 = [
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
        name: 'Huan',
        friends: ['Juan'],
        gender: 'male'
    }
];

describe('Есть несвязный элемент', () => {
    it('Он не будет приглашен, а программа завершит работу', () => {
        const maleFilter = new lib.MaleFilter();
        const femaleFilter = new lib.FemaleFilter();
        const maleIterator = new lib.LimitedIterator(friends6, maleFilter, 2);
        const femaleIterator = new lib.Iterator(friends6, femaleFilter);

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

        function friend(name) {
            let len = friends6.length;

            while (len--) {
                if (friends6[len].name === name) {
                    return friends6[len];
                }
            }
        }
    });
});

const friends7 = [
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
        friends: ['Brad', 'Itan', 'Huan'],
        gender: 'female'
    },
    {
        name: 'Huan',
        friends: ['Julia'],
        gender: 'Attack Helicopter'
    }
];

describe('Есть кто-то идентифицирующийся как боевой вертолет', () => {
    it('Его тоже не приглашаем.', () => {
        const maleFilter = new lib.MaleFilter();
        const femaleFilter = new lib.FemaleFilter();
        const maleIterator = new lib.LimitedIterator(friends7, maleFilter, 2);
        const femaleIterator = new lib.Iterator(friends7, femaleFilter);

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

        function friend(name) {
            let len = friends7.length;

            while (len--) {
                if (friends7[len].name === name) {
                    return friends7[len];
                }
            }
        }
    });
});


const friends10 = [
    {
        "name": "Nina",
        "gender": "female",
        "best": true,
        "friends": [
            "Anna"
        ]
    },
    {
        "name": "Tina",
        "gender": "female",
        "best": true,
        "friends": [
            "Jin",
            "Sam"
        ]
    },
    {
        "name": "Anna",
        "gender": "female",
        "best": false,
        "friends": [
            "Nina",
            "Kate"
        ]
    },
    {
        "name": "Jin",
        "gender": "female",
        "best": false,
        "friends": [
            "Tina",
            "Kate",
            "Jim"
        ]
    },
    {
        "name": "Sam",
        "gender": "male",
        "best": false,
        "friends": [
            "Nick"
        ]
    },
    {
        "name": "Kate",
        "gender": "female",
        "best": false,
        "friends": [
            "Anna",
            "Jin",
            "Pite"
        ]
    },
    {
        "name": "Jim",
        "gender": "male",
        "best": false,
        "friends": [
            "Jin"
        ]
    },
    {
        "name": "Nick",
        "gender": "male",
        "best": false,
        "friends": [
            "Sam"
        ]
    },
    {
        "name": "Pite",
        "gender": "male",
        "best": false,
        "friends": [
            "Kate"
        ]
    },
    {
        "name": "Max",
        "gender": "male",
        "best": false,
        "friends": []
    }
    ];


describe('test', () => {
    it('Должен быть не приглашен.', () => {
        const maleIterator = new lib.Iterator(friends10, new lib.MaleFilter());

        const invitedFriends = [];

        while (!maleIterator.done()) {
            invitedFriends.push(maleIterator.next());
        }

        console.info(invitedFriends);

        assert.deepStrictEqual(invitedFriends, [
            friend('Jim'), friend('Pite'),
            friend('Nick'), friend('Sam')
        ]);

        function friend(name) {
            let len = friends10.length;

            while (len--) {
                if (friends10[len].name === name) {
                    return friends10[len];
                }
            }
        }
    });
});
