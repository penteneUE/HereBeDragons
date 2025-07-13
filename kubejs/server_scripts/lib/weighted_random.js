//priority: 2
/**
 * @template T
 * @typedef {object} WeightedRandom
 * @property {Map<T, number>} items
 * @property {(item: T, weight: number) => WeightedRandom<T>} add
 * @property {() => number} sum
 * @property {() => T} getItem
 */

/**
 *
 * @returns {WeightedRandom<any>}
 */
function weightedRandom() {
    return global.UTILS.weightedRandom();
}
