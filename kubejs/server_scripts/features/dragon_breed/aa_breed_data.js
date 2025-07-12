/**
 * @typedef {object} DragonBreedData
 * @property {integer} strength aka. STR
 * @property {integer} constitution aka. CON
 * @property {integer} dexterity aka. DEX
 * @property {$CompoundTag_} traits 特性列表
 * WIP: 负面特性(penalty)列表
 * 三种属性全部到达256后，可以用特殊道具继续对力量&体质进行提升，不会遗传给后代
 * 初始属性0-128
 * 初始特性1-2
 * 初始负面特性0-2
 */
const BREED_DATA_KEY = "breedData";

let $ArrayList = Java.loadClass("java.util.ArrayList");

//let $List = Java.loadClass("java.util.List");

/**
 * @param {DragonBreedData} obj
 * @returns {$CompoundTag_}
 */
function serializeBreedData(obj) {
    let tag = new $CompoundTag();
    tag.putInt("strength", obj.strength ?? 0);
    tag.putInt("constitution", obj.constitution ?? 0);
    tag.putInt("dexterity", obj.dexterity ?? 0);

    tag.put("traits", obj.traits ?? {});
    return tag;
}

/**
 *
 * @param {$CompoundTag_} tag
 * @returns {DragonBreedData}
 */
function deserializeBreedData(tag) {
    return {
        strength: tag.getInt("strength") ?? 0,
        constitution: tag.getInt("constitution") ?? 0,
        dexterity: tag.getInt("dexterity") ?? 0,
        traits: tag.get("traits") ?? new $CompoundTag(),
    };
}

/**
 * @param {$RandomSource_} random
 * @returns {$CompoundTag_}
 */
function randomTraits(random) {
    let tag = new $CompoundTag();

    let traits = new $ArrayList();
    traits.addAll(breedTraitMap.keySet());
    let traitCount = random.nextIntBetweenInclusive(1, 2);
    for (let i = 0; i < traitCount; i++) {
        let selectedTrait = traits[random.nextInt(traits.length)];
        tag.putInt(selectedTrait, random.nextInt(2));
    }

    return tag;
}

/**
 * @param {$RandomSource_} random
 * @returns {$CompoundTag_}
 */
function randomBreedData(random) {
    let str = random.nextIntBetweenInclusive(0, 128);
    let con = random.nextIntBetweenInclusive(0, 128);
    let dex = random.nextIntBetweenInclusive(0, 128);

    let traits = randomTraits(random);

    return serializeBreedData({
        strength: str,
        constitution: con,
        dexterity: dex,
        traits: traits,
    });
    //let tag = new $CompoundTag()
}

/**
 * @typedef {object} DragonBreedTrait
 * @property {string} name 是TranslationKey
 * @property {string} desc
 * @property {string} fullDesc
 * @property {(text: ReturnType<typeof Text.of>) => $MutableComponent_} color
 */

/**
 * @type {$HashMap_<string, DragonBreedTrait} name和Desc均为translationKey
 */
const breedTraitMap = Utils.newMap();

breedTraitMap.put("tough_claws", {
    name: "kubejs.breed.traits.tough_claws.name", // 硬爪
    desc: "kubejs.breed.traits.tough_claws.desc", // 爪牙异常地坚硬，能够更好地撕碎东西。
    fullDesc: "kubejs.breed.traits.tough_claws.desc.full", // 近战伤害提升40%（不包括龙息等远程伤害）
    color: (text) => text.gold(),
});

breedTraitMap.put("multiscale", {
    name: "kubejs.breed.traits.multiscale.name", // 多鳞
    desc: "kubejs.breed.traits.multiscale.desc", // 皮下生长出了一层额外的鳞片，在完好时能抵御更多伤害。
    fullDesc: "kubejs.breed.traits.multiscale.desc.full", // 生命值全满时，受到伤害减少50%
    color: (text) => text.gold(),
});

breedTraitMap.put("regenerator", {
    name: "kubejs.breed.traits.regenerator.name", // 再生者
    desc: "kubejs.breed.traits.regenerator.desc", // 血肉在无干扰时可以瞬间快速生长。
    fullDesc: "kubejs.breed.traits.regenerator.desc.full", // 收入龙吟号角后回复10%生命值。如果是玩家，在受伤后三秒没受伤害时回复30%生命。
    color: (text) => text.gold(),
});

breedTraitMap.put("stopouch", {
    name: "kubejs.breed.traits.stopouch.name", // 胃袋
    desc: "kubejs.breed.traits.stopouch.desc", // 拥有一个大胃袋，可以存储一个生物。
    fullDesc: "kubejs.breed.traits.stopouch.desc.full", // 可以在腹中携带一个小/中/任意生物，先用拴绳拴住目标生物，再右键该个体。如果是玩家得到此特性，“饕餮寓言”的存储容量会提升。
    color: (text) => text.gold(),
});
