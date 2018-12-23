'use strict';

class Filter {
    is() {
        return true;
    }
}

class FemaleFilter extends Filter {
    is(friend) {
        return ['female', 'bigender', 'transgender', 'genderfluid'].includes(friend.gender);
    }
}

class MaleFilter extends FemaleFilter {
    is(friend) {
        return !super.is(friend);
    }
}

class Iterator {
    constructor(friends, filter) {
        if (filter instanceof Filter) {
            this.friends = friends;
            this.filter = filter;
            this.queue = friends.filter(x => x.best);
            this.layer = [];
            this.index = 0;
            this.depth = 0;
            this.used = this.queue.map(x => x.name);
            this.sort();
        } else {
            throw new TypeError();
        }
    }

    sort() {
        this.layer = this.queue.filter(x => this.filter.is(x));
        this.layer.sort((a, b) => a.name.localeCompare(b.name));
    }

    done() {
        if (this.index < this.layer.length) {
            return false;
        }
        if (!this.queue.length) {
            return true;
        }
        this.queue = this.queue.reduce((acc, friend) => {
            const nextFriends = this.friends
                .filter(x => friend.friends.includes(x.name))
                .filter(x => !this.used.includes(x.name));
            this.used.push(...nextFriends.map(x => x.name));

            return acc.concat(nextFriends);
        }, []);
        this.sort();
        this.depth++;
        this.index = 0;

        return this.done();
    }

    next() {
        return this.done() ? null : this.layer[this.index++];
    }
}

class LimitedIterator extends Iterator {
    constructor(friends, filter, maxDepth) {
        super(friends, filter);
        this.maxDepth = maxDepth;
    }

    done() {
        return this.depth >= this.maxDepth || super.done();
    }

    next() {
        return this.done() ? null : super.next();
    }
}

module.exports = {
    Iterator,
    LimitedIterator,
    Filter,
    MaleFilter,
    FemaleFilter
};
