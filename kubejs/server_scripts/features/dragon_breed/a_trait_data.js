/**
 * @typedef {object} DragonBreedTrait
 * @property {string} name 是TranslationKey
 * @property {string} desc
 * @property {string} fullDesc
 * @property {string | null} stage
 * @property {(text: ReturnType<typeof Text.of>) => $MutableComponent_} color
 */

/**
 * @type {$HashMap_<string, DragonBreedTrait} name和Desc均为translationKey
 */
const breedTraitMap = Utils.newMap();

/**
 *
 * @param {string} id
 * @param {DragonBreedTrait["color"]} [color]
 */
function _registerTrait(id, color) {
    breedTraitMap.put(id, {
        name: `kubejs.breed.traits.${id}.name`,
        desc: `kubejs.breed.traits.${id}.desc`,
        fullDesc: `kubejs.breed.traits.${id}.desc.full`,
        stage: `quest/breed.${id}`,
        color: color ?? ((text) => text.gold()),
    });
}

_registerTrait("tough_claws"); // 近战伤害提升10/20/40%，不包括龙息等远程伤害。
_registerTrait("multiscale"); // 生命值全满时，受到伤害减少30/40/60%。"
_registerTrait("regenerator"); // 收入龙吟号角后回复4%/10%/20%生命值。如果是玩家，在受伤后三秒没受伤害时回复10/20/40%生命。",
_registerTrait("stopouch"); // 可以在腹中携带一个小/中/任意生物，先用拴绳拴住目标生物，再右键该个体。如果是玩家得到此特性，“饕餮寓言”的存储容量会提升。
