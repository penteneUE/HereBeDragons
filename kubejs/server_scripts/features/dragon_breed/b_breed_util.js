let $HashSet = Java.loadClass("java.util.HashSet");

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
    switch (item.id) {
        case "iceandfire:dragon_horn":
            let comp = item.getComponentMap().get("iceandfire:dragon_horn");

            let breedData = comp
                .entityData()
                .get("KubeJSPersistentData")
                .get(BREED_DATA_KEY);
            return breedData;
        case "kubejs:gene_holder":
            return item.getCustomData().get(BREED_DATA_KEY);
        case "kubejs:gene_splicer":
        default:
            return item.getCustomData();
    }
}

/**
 *
 * @param {ReturnType<Item.of>} item
 * @returns {"iceandfire:fire_dragon" | "iceandfire:ice_dragon" | "iceandfire:lightning_dragon"}
 */
function getDragonTypeFromItem(item) {
    switch (item.id) {
        case "iceandfire:dragon_horn":
            let comp = item.getComponentMap().get("iceandfire:dragon_horn");
            let type = comp.entityType();
            //console.log(type);
            return type;
        case "kubejs:gene_holder":
            return item.getCustomData().get("holding");
        case "iceandfire:dragonegg_red":
        case "iceandfire:dragonegg_green":
        case "iceandfire:dragonegg_bronze":
        case "iceandfire:dragonegg_gray":
            return "iceandfire:fire_dragon";
        case "iceandfire:dragonegg_sapphire":
        case "iceandfire:dragonegg_white":
        case "iceandfire:dragonegg_blue":
        case "iceandfire:dragonegg_silver":
            return "iceandfire:ice_dragon";
        case "iceandfire:dragonegg_electric":
        case "iceandfire:dragonegg_amethyst":
        case "iceandfire:dragonegg_copper":
        case "iceandfire:dragonegg_black":
            return "iceandfire:lightning_dragon";
        default:
            return item.getCustomData();
    }
}

/**
 * @param {$EntityDragonBase_ | $EntityDragonEgg_ | $Player_} entity Dragon or Egg
 * @returns {$CompoundTag_}
 */
function getBreedDataFromEntity(entity) {
    return entity.persistentData.get(BREED_DATA_KEY);
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
    traits.addAll(getGlobalBreedTraitData().keySet());
    let traitCount = random.nextIntBetweenInclusive(1, 3);
    for (let i = 0; i < traitCount; i++) {
        let selectedTrait = traits[random.nextInt(traits.length)];
        tag.putInt(selectedTrait, 0);
    }
    if (random.nextInt(101) < 6) {
        let gotTraits = new $ArrayList();
        gotTraits.addAll(tag.getAllKeys());
        tag.putInt(gotTraits[random.nextInt(gotTraits.size())], 1);
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
 * @returns {number} 0-256
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
 *
 * @param {$RandomSource_} random
 * @param {$CompoundTag_} fatherTraits
 * @param {$CompoundTag_} motherTraits
 * @returns {$CompoundTag_}
 */
function generateChildTraits(random, fatherTraits, motherTraits) {
    //let allTraitsSet = traitsA.getAllKeys().addAll(traitsB.getAllKeys());
    let tag = new $CompoundTag();

    /**
     * @type {import("java.util.Set").$Set}
     */
    let traits = new $HashSet();

    traits.addAll(fatherTraits.getAllKeys());
    traits.addAll(motherTraits.getAllKeys());

    for (const trait of traits) {
        let levelF = Utils.parseInt(
            fatherTraits.contains(trait) ? fatherTraits.getInt(trait) : -1,
            -1
        );
        let levelM = Utils.parseInt(
            motherTraits.contains(trait) ? motherTraits.getInt(trait) : -1,
            -1
        );

        if (levelF > -1 && levelF < 2) {
            levelF = random.nextBoolean() ? levelF : levelF - 1;
        }
        if (levelM > -1 && levelM < 2) {
            levelM = random.nextBoolean() ? levelM : levelM - 1;
        }
        let sum = levelF + levelM;
        let levelChild =
            levelF == levelM ? (sum == 0 ? 1 : sum) : Math.max(levelF, levelM);

        if (levelChild > 3) levelChild = 3;

        if (levelChild > -1) {
            tag.putInt(trait, levelChild);
        }
    }
    // traits.addAll(traitsA.getAllKeys().addAll(traitsB.getAllKeys()));
    // console.log(traits);
    // tag.put("aa", traits);
    return tag;
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
        traits: generateChildTraits(random, male.traits, female.traits),
    };
}

/**
 *
 * @param {$CompoundTag_} traits
 * @param {string} key
 * @returns {integer}
 */
function getTraitLvl(traits, key) {
    if (!traits) return -1;
    return traits.getInt(key) ?? -1;
}

/**
 *
 * @param {$LivingEntity_} entity
 * @param {string} key
 * @returns {integer}
 */
function getTraitFromEntity(entity, key) {
    let breedData = getBreedDataFromEntity(entity);
    if (!breedData) return -1;
    return getTraitLvl(breedData.get("traits"), key);
}

/**
 *
 * @param {string} color
 * @returns {"iceandfire:fire_dragon" | "iceandfire:ice_dragon" | "iceandfire:lightning_dragon"}
 */
function eggColorToDragonType(color) {
    let col = color.toLowerCase();
    switch (col) {
        case "red":
        case "green":
        case "bronze":
        case "gray":
            return "iceandfire:fire_dragon";
        case "sapphire":
        case "white":
        case "blue":
        case "silver":
            return "iceandfire:ice_dragon";
        case "electric":
        case "amethyst":
        case "copper":
        case "black":
            return "iceandfire:lightning_dragon";
    }
}

/**
 *
 * @param {$EntityDragonEgg_} entity
 */
function isIceDragonEgg(entity) {
    return (
        eggColorToDragonType(entity.getEggType().name()) ==
        "iceandfire:ice_dragon"
    );
}

// ItemEvents.rightClicked((event) => {
//     let {
//         player,
//         player: { mainHandItem, offHandItem },
//     } = event;

//     if (
//         !mainHandItem.hasTag("kubejs:items_with_breed_data") ||
//         !offHandItem.hasTag("kubejs:items_with_breed_data")
//     ) {
//         player.tell("主手和副手必须拿着龙蛋、龙号角或基因容器");
//         return;
//     }
//     let parent1 = getBreedDataFromItem(mainHandItem);
//     let parent2 = getBreedDataFromItem(offHandItem);
//     // console.log(player.mainHandItem);
//     // console.log(player.offHandItem);
//     player.tell(
//         serializeBreedData(
//             getChildBreedData(player.getRandom(), parent1, parent2)
//         )
//     );
// });
