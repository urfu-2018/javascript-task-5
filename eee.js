'use strict';

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

let t = femaleFilter.it({
    name: 'Sally',
    friends: ['Emily', 'Brad'],
    gender: 'female',
    best: true
});

console.info(t);
