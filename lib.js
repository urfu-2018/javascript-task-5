'use strict';

/**
 * Фильтр друзей
 */
class Filter {
    isValid() {
        return true;
    }
}

/**
 * Фильтр друзей
 * @extends Filter
 */
class MaleFilter extends Filter {
    isValid(friend) {
        return super.isValid(friend) && friend.gender === 'male';
    }
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 */
class FemaleFilter extends Filter {
    isValid(friend) {
        return super.isValid(friend) && friend.gender === 'female';
    }
}

/**
 * Итератор по друзьям
 */
class Iterator {

    /**
     * @param {Object[]} friends
     * @param {Filter} filter
     */
    constructor(friends, filter) {
        if (!(filter instanceof Filter)) {
            throw new TypeError();
        }

        this._index = 0;
        this._maxLevel = Number.POSITIVE_INFINITY;
        this._friends = friends;
        this._filter = filter;
    }

    get _friendsLinerization() {
        if (this._linerization === undefined) {
            this._linerization = this._linearizeFriends(this._friends).filter(this._filter.isValid);
        }

        return this._linerization;
    }

    _linearizeFriends(friends) {
        const result = [];
        const alreadyInvited = new Set();
        const nameToFriendMap = new Map(friends.map(friend => [friend.name, friend]));

        let currentCircle = friends
            .filter(friend => friend.best)
            .sort((u, v) => u.name.localeCompare(v.name))
            .filter(friend => alreadyInvited.add(friend.name) && true);

        while (this._maxLevel > 0 && currentCircle.length > 0) {
            result.push(...currentCircle);
            currentCircle = this._getFriendsFor(currentCircle, alreadyInvited, nameToFriendMap);
            this._maxLevel--;
        }

        return result;
    }

    _getFriendsFor(people, alreadyInvited, nameToFriendMap) {
        const result = [];

        people.forEach(friend =>
            friend.friends
                .filter(friendOfFriend => !alreadyInvited.has(friendOfFriend))
                .forEach(friendOfFriend => {
                    alreadyInvited.add(friendOfFriend);
                    result.push(nameToFriendMap.get(friendOfFriend));
                })
        );

        return result.sort((u, v) => u.name.localeCompare(v.name));
    }

    done() {
        return this._index >= this._friendsLinerization.length;
    }

    next() {
        return !this.done() ? this._friendsLinerization[this._index++] : null;
    }
}

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 */
class LimitedIterator extends Iterator {
    // noinspection JSCheckFunctionSignatures
    /**
     * @param {Object[]} friends
     * @param {Filter} filter
     * @param {Number} maxLevel – максимальный круг друзей
     */
    constructor(friends, filter, maxLevel) {
        super(friends, filter);
        this._maxLevel = maxLevel;
    }
}


exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
