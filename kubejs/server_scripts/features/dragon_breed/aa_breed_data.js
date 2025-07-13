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
 *
 * @param {ReturnType<Item.of>} item
 * @returns {$CompoundTag_}
 */
function getBreedDataFromItem(item) {
    if (item.is("iceandfire:dragon_horn")) {
        let comp = item.getComponentMap().get("iceandfire:dragon_horn");

        let breedData = comp
            .entityData()
            .get("KubeJSPersistentData")
            .get(BREED_DATA_KEY);
        return breedData;
    }
    return item.getCustomData();
}

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
 *
 * @param {$RandomSource_} random
 * @param {number} num
 */
function randomPositiveOrNegative(random, num) {
    return num * (random.nextBoolean() ? 1 : -1);
}

/**
 * @param {$RandomSource_} random
 * @param {number} n1
 * @param {number} n2
 * @returns {number}
 */
function generateChildAttr(random, n1, n2) {
    let pickN1 = random.nextBoolean();
    let result = Utils.parseInt(pickN1 ? n1 : n2, 0); // 随机选择父母属性其一
    // result = result + random.nextInt(21) * (random.nextBoolean() ? 1 : -1);
    result =
        result +
        randomPositiveOrNegative(random, random.nextInt(10)) + // 随机+-0-10 (fixed)
        randomPositiveOrNegative(
            random,
            (random.nextInt(21) * (256 - result)) / 100
        ); // 随机+- 百分比 属性越高变化越小 WIP这部分随pickN1变动

    if (result > 256) result = 256;
    if (result < 0) result = 0;
    return result;
}

/**
 * @param {$RandomSource_} random
 * @param {DragonBreedData} male
 * @param {DragonBreedData} female
 * @returns {DragonBreedData}
 */
function getChildBreedData(random, male, female) {
    let str = generateChildAttr(random, male.strength, female.strength);
    let con = generateChildAttr(random, male.constitution, female.constitution);
    let dex = generateChildAttr(random, male.dexterity, female.dexterity);
    // console.log(str);
    return {
        strength: Math.floor(str),
        constitution: Math.floor(con),
        dexterity: Math.floor(dex),
        traits: {},
    };
}

// ItemEvents.rightClicked("iceandfire:dragonegg_black", (event) => {
//     let {
//         player,
//         player: { mainHandItem, offHandItem },
//     } = event;

//     if (
//         !mainHandItem.hasTag("kubejs:dragon_eggs") ||
//         !offHandItem.hasTag("kubejs:dragon_eggs")
//     ) {
//         player.tell("主手和副手必须拿着龙蛋");
//         return;
//     }
//     let parent1 = mainHandItem.getCustomData();
//     let parent2 = offHandItem.getCustomData();
//     // console.log(player.mainHandItem);
//     // console.log(player.offHandItem);
//     player.tell(
//         serializeBreedData(
//             getChildBreedData(player.getRandom(), parent1, parent2)
//         )
//     );
// });

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
        color: color ?? ((text) => text.gold()),
    });
}

_registerTrait("tough_claws"); // 近战伤害提升10/20/40%，不包括龙息等远程伤害。
_registerTrait("multiscale"); // 生命值全满时，受到伤害减少30/50/70%。"
_registerTrait("regenerator"); // 收入龙吟号角后回复4%/10%/20%生命值。如果是玩家，在受伤后三秒没受伤害时回复10/20/40%生命。",
_registerTrait("stopouch"); // 可以在腹中携带一个小/中/任意生物，先用拴绳拴住目标生物，再右键该个体。如果是玩家得到此特性，“饕餮寓言”的存储容量会提升。
