'use strict';

class Filter {
    check() {
        return true;
    }
}

class MaleFilter extends Filter {
    constructor() {
        super();
    }

    check(friend) {
        return friend.gender === 'male';
    }
}

class FemaleFilter extends Filter {
    constructor() {
        super();
    }

    check(friend) {
        return friend.gender === 'female';
    }
}

function getGuests(friends, filter, maxLevel = Infinity) {
    let circle = friends.filter(friend => friend.best).sort((a, b) => a.name.localeCompare(b.name));
    let guestList = [];
    let level = 0;
    while (level < maxLevel && circle.length > 0) {
        guestList.push(...circle);
        circle = getNextCircle(circle, guestList, friends);
        level++;
    }

    return guestList;
}

function getNextCircle(circle, guestList, friends) {
    return [...new Set(circle
        .map(p => p.friends)
        .reduce((result, f) => [...result, ...f], [])
        .map(name => friends.find(friend => friend.name === name))
        .filter(friend => !guestList.includes(friend)))]
        .sort((a, b) => a.name.localeCompare(b.name));
}


class Iterator {
    constructor(friends, filter, maxLevel = Infinity) {
        if (!(filter instanceof Filter)) {
            throw new TypeError();
        }
        console.info(friends, filter);

        /*
        let iteration = friends
            .filter(friend => friend.best)
            .sort((a, b) => a.name.localeCompare(b.name));
        let guests = [];
        for (let i = 0; i < maxLevel && iteration.length > 0; i++) {
            guests.push(...iteration);
            iteration = [...new Set(iteration
                .map(p => p.friends)
                .reduce((result, f) => result.concat(f), [])
                .map(n => friends
                    .find(f => f.name === n))
                .filter(friend => !guests.includes(friend)))];
        }*/

        const pickedFriends = getGuests(friends, filter, maxLevel).filter(filter.check);
        this.collection = pickedFriends.filter(e => filter.check(e));
        this.index = 0;
    }

    next() {
        return this.done() ? null : this.collection[this.index++];
    }

    done() {
        return this.index === this.collection.length;
    }
}

class LimitedIterator extends Iterator {
    constructor(friends, filter, maxLevel) {
        super(friends, filter, maxLevel);
    }
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
