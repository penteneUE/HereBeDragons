/**
 * @typedef {object} DragonBreedTrait
 * @property {string} name 是TranslationKey
 * @property {string} desc
 * @property {string} fullDesc
 * @property {string | null} stage
 * @property {(text: ReturnType<typeof Text.of>) => $MutableComponent_} color
 */

/**
 *
 * @returns {$HashMap_<string, DragonBreedTrait>} name和Desc均为translationKey
 */
function getGlobalBreedTraitData() {
    return global.BREED_TRAIT_DATA;
}

/**
 * @type {WeightedRandom<string>}
 */
const wildRandomTraits = weightedRandom()
    .add("tough_claws", 1)
    .add("multiscale", 1)
    .add("regenerator", 1)
    .add("stopouch", 1)
    .add("down", 1)
    .add("no_flesh", 1)
    .add("antimemetic", 0.2);
