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
