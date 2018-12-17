'use strict';

const lib = require('./lib');

const friends = [
    {
        name: 'Sergey',
        friends: ['Denis', 'Maria'],
        gender: 'male',
        best: true
    },
    {
        name: 'Lena',
        friends: ['Dasha', 'Egor'],
        gender: 'female',
        best: true
    },
    {
        name: 'Denis',
        gender: 'male',
        friends: ['Sergey', 'Vasily', 'Katya']
    },
    {
        name: 'Maria',
        gender: 'female',
        friends: ['Sergey', 'Pavel', 'Liza']
    },
    {
        name: 'Vasily',
        gender: 'male',
        friends: ['Denis']
    },
    {
        name: 'Katya',
        gender: 'female',
        friends: ['Denis']
    },
    {
        name: 'Pavel',
        gender: 'male',
        friends: ['Maria']
    },
    {
        name: 'Liza',
        gender: 'female',
        friends: ['Maria']
    },
    {
        name: 'Egor',
        gender: 'male',
        friends: ['Lena', 'Leonid', 'Nastya']
    },
    {
        name: 'Dasha',
        gender: 'female',
        friends: ['Lena', 'Ibragim', 'Diana']
    },
    {
        name: 'Leonid',
        gender: 'male',
        friends: ['Egor', 'Serafima']
    },
    {
        name: 'Nastya',
        gender: 'female',
        friends: ['Egor']
    },
    {
        name: 'Ibragim',
        gender: 'male',
        friends: ['Dasha']
    },
    {
        name: 'Diana',
        gender: 'female',
        friends: ['Dasha']
    },
    {
        name: 'Serafima',
        friends: ['Leonid'],
        gender: 'female'
    }
];

// Создаем фильтры парней и девушек
const maleFilter = new lib.MaleFilter();
const femaleFilter = new lib.FemaleFilter();

// Создаем итераторы
const femaleIterator = new lib.Iterator(friends, femaleFilter);

// Среди парней приглашаем только луших друзей и друзей лучших друзей
const maleIterator = new lib.LimitedIterator(friends, maleFilter, 1);

const invitedFriends = [];

function toName(friend) {
    return friend.name;
}

// Собираем пары «парень + девушка»
while (!maleIterator.done() && !femaleIterator.done()) {
    invitedFriends.push([
        toName(maleIterator.next()),
        toName(femaleIterator.next())
    ]);
}

// Если остались девушки, то приглашаем остальных
while (!femaleIterator.done()) {
    invitedFriends.push(toName(femaleIterator.next()));
}

console.info(invitedFriends);
// Sam, Sally
// Brad, Emily
// Mat, Sharon
// Julia
