function weightedRandom() {
    let builder = {
        /**
         * @type {Map<any, number>}
         */
        items: new Map(),
        /**
         * @param {any} item
         * @param {number} weight
         */
        add: function (item, weight) {
            builder.items.set(item, weight);
            return builder;
        },
        sum: function () {
            const items = Array.from(this.items.values());
            let total = 0.0;
            items.forEach((value) => {
                total += value;
            });
            return total;
        },
        getItem: function () {
            const items = Array.from(this.items);
            //var pmf = [0.8, 0.1, 0.1];
            //var pmf = Array.from(items.values())
            //var cdf = pmf.map((sum => value => sum += value)(0));

            let max = items[0][1];
            let random = Math.random() * this.sum();

            for (let index = 0; index < items.length; index++) {
                if (random < max) {
                    return items[index][0];
                } else if (index == items.length - 1) {
                    return items[items.length - 1][0];
                }
                max += items[index + 1][1];
            }

            return -1;
        },
    };

    return builder;
}
global.UTILS.weightedRandom = weightedRandom;

const structureData = Utils.newMap();

const villageMobs = Utils.newList();
villageMobs.addAll(["guardvillagers:guard", "minecraft:iron_golem"]);

const pillageMobs = Utils.newList();
pillageMobs.addAll(["minecraft:pillager", "minecraft:vindicator"]);

const commonMonsters = Utils.newList();
commonMonsters.addAll([
    "minecraft:zombie",
    "minecraft:skeleton",
    "minecraft:husk",
    "minecraft:stray",
    "minecraft:drowned",
    "minecraft:spider",
]);

const mansionMobs = Utils.newList();
mansionMobs.addAll(pillageMobs);
mansionMobs.addAll(commonMonsters);

const monumentMobs = Utils.newList();
monumentMobs.addAll(commonMonsters);
monumentMobs.add("minecraft:guardian");

const netherMonsters = Utils.newList();
netherMonsters.addAll([
    "minecraft:piglin",
    "minecraft:piglin_brute",
    "minecraft:blaze",
    "minecraft:wither_skeleton",
    "minecraft:zombified_piglin",
]);

structureData.put("skyvillages:skyvillage", {
    gateway: "kubejs:village/sky_village",
    name: "kubejs.recipeinfo.conquest.sky_village",
    description: "kubejs.recipeinfo.conquest.sky_village.description",
    mobs: villageMobs,
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:emerald", 2)
            .add("minecraft:iron_ingot", 1)
            .add("minecraft:gold_ingot", 2)
            .add("dragonsurvival:elder_dragon_dust", 1),
        //.add('minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:mending":1}}]', 1),
        count: 3,
    },
});

const smallVillageData = {
    gateway: "kubejs:village/small_village",
    name: "kubejs.recipeinfo.conquest.small_village",
    description: "kubejs.recipeinfo.conquest.small_village.description",
    mobs: villageMobs,
    product: {
        //每日结算
        item: weightedRandom()
            // .add("minecraft:mutton", 1)
            // .add("minecraft:beef", 1)
            // .add("minecraft:chicken", 1)
            // .add("minecraft:porkchop", 1)
            .add("minecraft:emerald", 2)
            .add("minecraft:iron_ingot", 2)
            .add("minecraft:gold_ingot", 2)
            .add("minecraft:diamond", 1)
            .add("dragonsurvival:elder_dragon_bone", 0.5),
        count: 6,
    },
};

const mediumVillageData = {
    gateway: "kubejs:village/medium_village",
    name: "kubejs.recipeinfo.conquest.medium_village",
    description: "kubejs.recipeinfo.conquest.medium_village.description",
    mobs: villageMobs,
    product: {
        //每日结算
        item: weightedRandom()
            // .add("minecraft:mutton", 1)
            // .add("minecraft:beef", 1)
            // .add("minecraft:chicken", 1)
            // .add("minecraft:porkchop", 1)
            .add("minecraft:emerald", 2)
            .add("minecraft:iron_ingot", 2)
            .add("minecraft:gold_ingot", 2)
            .add("minecraft:diamond", 1)
            .add("dragonsurvival:elder_dragon_bone", 0.5)
            .add("dragonsurvival:heart_element", 0.2)
            .add(
                'minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:mending":1}}]',
                0.05
            )
            .add(
                'minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:unbreaking":1}}]',
                0.05
            )
            .add(
                'minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:sharpness":3}}]',
                0.05
            )
            .add(
                'minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:efficiency":3}}]',
                0.05
            ),
        count: 10,
    },
};

const largeVillageData = {
    gateway: "kubejs:village/large_village",
    name: "kubejs.recipeinfo.conquest.large_village",
    description: "kubejs.recipeinfo.conquest.large_village.description",
    mobs: villageMobs,
    product: {
        //每日结算
        item: weightedRandom()
            // .add("minecraft:mutton", 1)
            // .add("minecraft:beef", 1)
            // .add("minecraft:chicken", 1)
            // .add("minecraft:porkchop", 1)
            .add("minecraft:emerald", 2)
            .add("minecraft:iron_ingot", 2)
            .add("minecraft:gold_ingot", 2)
            .add("minecraft:diamond", 1)
            .add("dragonsurvival:elder_dragon_bone", 0.4)
            .add("dragonsurvival:heart_element", 0.2)
            .add("dragonsurvival:weak_dragon_heart", 0.1)
            .add(
                'minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:mending":1}}]',
                0.05
            )
            .add(
                'minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:unbreaking":2}}]',
                0.05
            )
            .add(
                'minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:sharpness":4}}]',
                0.05
            )
            .add(
                'minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:efficiency":4}}]',
                0.05
            ),
        count: 16,
    },
};

//小型村庄
Array.of(
    //原版村庄
    "minecraft:village_desert",
    "minecraft:village_plains",
    "minecraft:village_savanna",
    "minecraft:village_snowy",
    "minecraft:village_taiga",
    //ctov小型村庄
    "ctov:small/village_beach",
    "ctov:small/village_christmas",
    "ctov:small/village_dark_forest",
    "ctov:small/village_desert",
    "ctov:small/village_desert_oasis",
    "ctov:small/village_jungle",
    "ctov:small/village_jungle_tree",
    "ctov:small/village_mesa",
    "ctov:small/village_mesa_fortified",
    "ctov:small/village_mountain",
    "ctov:small/village_mountain_alpine",
    "ctov:small/village_mushroom",
    "ctov:small/village_plains",
    "ctov:small/village_plains_fortified",
    "ctov:small/village_savanna",
    "ctov:small/village_savanna_na",
    "ctov:small/village_snowy_igloo",
    "ctov:small/village_swamp",
    "ctov:small/village_swamp_fortified",
    "ctov:small/village_taiga",
    "ctov:small/village_underground"
).forEach((structure) => {
    structureData.put(structure, smallVillageData);
});

Array.of(
    //原版村庄
    "minecraft:village_desert",
    "minecraft:village_plains",
    "minecraft:village_savanna",
    "minecraft:village_snowy",
    "minecraft:village_taiga",
    //ctov中型村庄
    "ctov:medium/village_beach",
    "ctov:medium/village_christmas",
    "ctov:medium/village_dark_forest",
    "ctov:medium/village_desert",
    "ctov:medium/village_desert_oasis",
    "ctov:medium/village_jungle",
    "ctov:medium/village_jungle_tree",
    "ctov:medium/village_mesa",
    "ctov:medium/village_mesa_fortified",
    "ctov:medium/village_mountain",
    "ctov:medium/village_mountain_alpine",
    "ctov:medium/village_mushroom",
    "ctov:medium/village_plains",
    "ctov:medium/village_plains_fortified",
    "ctov:medium/village_savanna",
    "ctov:medium/village_savanna_na",
    "ctov:medium/village_snowy_igloo",
    "ctov:medium/village_swamp",
    "ctov:medium/village_swamp_fortified",
    "ctov:medium/village_taiga",
    "ctov:medium/village_underground"
).forEach((structure) => {
    structureData.put(structure, mediumVillageData);
});

Array.of(
    //原版村庄
    "minecraft:village_desert",
    "minecraft:village_plains",
    "minecraft:village_savanna",
    "minecraft:village_snowy",
    "minecraft:village_taiga",
    //ctov大型村庄
    "ctov:large/village_beach",
    "ctov:large/village_christmas",
    "ctov:large/village_dark_forest",
    "ctov:large/village_desert",
    "ctov:large/village_desert_oasis",
    "ctov:large/village_jungle",
    "ctov:large/village_jungle_tree",
    "ctov:large/village_mesa",
    "ctov:large/village_mesa_fortified",
    "ctov:large/village_mountain",
    "ctov:large/village_mountain_alpine",
    "ctov:large/village_mushroom",
    "ctov:large/village_plains",
    "ctov:large/village_plains_fortified",
    "ctov:large/village_savanna",
    "ctov:large/village_savanna_na",
    "ctov:large/village_snowy_igloo",
    "ctov:large/village_swamp",
    "ctov:large/village_swamp_fortified",
    "ctov:large/village_taiga",
    "ctov:large/village_underground"
).forEach((structure) => {
    structureData.put(structure, largeVillageData);
});

const shipwreckData = {
    gateway: "kubejs:misc/shipwreck",
    name: "kubejs.recipeinfo.conquest.shipwreck",
    description: "kubejs.recipeinfo.conquest.shipwreck.description",
    mobs: commonMonsters,
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:pufferfish", 1)
            .add("minecraft:cod", 2)
            .add("minecraft:salmon", 2)
            .add("minecraft:kelp", 1)
            .add("minecraft:ink_sac", 1),
        count: 4,
    },
};

Array.of("minecraft:shipwreck", "minecraft:shipwreck_beached").forEach(
    (structure) => {
        structureData.put(structure, shipwreckData);
    }
);

structureData.put("minecraft:desert_pyramid", {
    gateway: "kubejs:misc/desert_pyramid",
    name: "kubejs.recipeinfo.conquest.desert_pyramid",
    description: "kubejs.recipeinfo.conquest.desert_pyramid.description",
    mobs: commonMonsters,
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:bone", 2)
            .add("minecraft:coal", 2)
            .add("dragonsurvival:charred_meat", 1)
            .add("dragonsurvival:charred_seafood", 1)
            .add("dragonsurvival:charred_mushroom", 1)
            .add("dragonsurvival:charred_vegetable", 1)
            .add("dragonsurvival:charged_coal", 0.5),
        //.add('minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:mending":1}}]', 1),
        count: 4,
    },
});

structureData.put("minecraft:jungle_pyramid", {
    gateway: "kubejs:misc/jungle_pyramid",
    name: "kubejs.recipeinfo.conquest.jungle_pyramid",
    description: "kubejs.recipeinfo.conquest.jungle_pyramid.description",
    mobs: commonMonsters,
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:bone", 2)
            .add("minecraft:rotten_flesh", 2)
            .add("minecraft:glow_berries", 2)
            .add("minecraft:red_mushroom", 1)
            .add("minecraft:brown_mushroom", 1),
        //.add('minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:mending":1}}]', 1),
        count: 4,
    },
});

const pillagerOutpostData = {
    gateway: "kubejs:pillage/pillager_outpost",
    name: "kubejs.recipeinfo.conquest.pillager_outpost",
    description: "kubejs.recipeinfo.conquest.pillager_outpost.description",
    mobs: pillageMobs,
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:emerald", 3)
            .add("minecraft:gold_ingot", 1)
            .add("minecraft:diamond", 1)
            .add("minecraft:experience_bottle", 1)
            .add("dragonsurvival:elder_dragon_bone", 0.3)
            .add("dragonsurvival:heart_element", 0.1),
        count: 6,
    },
};

Array.of(
    "minecraft:pillager_outpost",
    //ctov
    "ctov:pillager_outpost_badlands",
    "ctov:pillager_outpost_beach",
    "ctov:pillager_outpost_dark_forest",
    "ctov:pillager_outpost_desert",
    "ctov:pillager_outpost_jungle",
    "ctov:pillager_outpost_mesa",
    "ctov:pillager_outpost_mountain",
    "ctov:pillager_outpost_plains",
    "ctov:pillager_outpost_savanna",
    "ctov:pillager_outpost_snowy",
    "ctov:pillager_outpost_swamp",
    "ctov:pillager_outpost_taiga"
).forEach((structure) => {
    structureData.put(structure, pillagerOutpostData);
});

structureData.put("irons_spellbooks:evoker_fort", {
    gateway: "kubejs:pillage/evoker_fort",
    name: "kubejs.recipeinfo.conquest.evoker_fort",
    description: "kubejs.recipeinfo.conquest.evoker_fort.description",
    mobs: pillageMobs,
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:emerald", 3)
            .add("irons_spellbooks:arcane_essence", 1)
            .add("minecraft:diamond", 1)
            .add("minecraft:experience_bottle", 1)
            .add("irons_spellbooks:common_ink", 0.75)
            .add("irons_spellbooks:uncommon_ink", 0.25)
            .add("dragonsurvival:elder_dragon_bone", 0.2)
            .add("dragonsurvival:heart_element", 0.1)
            .add("dragonsurvival:weak_dragon_heart", 0.05),
        count: 16,
    },
});

structureData.put("minecraft:mansion", {
    gateway: "kubejs:pillage/mansion",
    name: "kubejs.recipeinfo.conquest.mansion",
    description: "kubejs.recipeinfo.conquest.mansion.description",
    mobs: mansionMobs,
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:emerald", 3)
            .add("minecraft:gold_ingot", 1)
            .add("minecraft:diamond", 1)
            .add("minecraft:experience_bottle", 1)
            .add("dragonsurvival:elder_dragon_bone", 0.2)
            .add("dragonsurvival:heart_element", 0.1)
            .add("dragonsurvival:weak_dragon_heart", 0.05)
            .add("minecraft:totem_of_undying", 0.1),
        count: 16,
    },
});

structureData.put("iceandfire:myrmex_hive_desert", {
    gateway: "kubejs:iceandfire/myrmex_hive_desert",
    name: "kubejs.recipeinfo.conquest.myrmex_hive_desert",
    description: "kubejs.recipeinfo.conquest.myrmex_hive_desert.description",
    product: {
        //每日结算
        item: weightedRandom().add("iceandfire:myrmex_desert_resin", 1),
        count: 3,
    },
});

structureData.put("iceandfire:myrmex_hive_jungle", {
    gateway: "kubejs:iceandfire/myrmex_hive_jungle",
    name: "kubejs.recipeinfo.conquest.myrmex_hive_jungle",
    description: "kubejs.recipeinfo.conquest.myrmex_hive_jungle.description",
    product: {
        //每日结算
        item: weightedRandom().add("iceandfire:myrmex_jungle_resin", 1),
        count: 3,
    },
});

structureData.put("iceandfire:pixie_village", {
    gateway: "kubejs:iceandfire/pixie_village",
    name: "kubejs.recipeinfo.conquest.pixie_village",
    description: "kubejs.recipeinfo.conquest.pixie_village.description",
    product: {
        //每日结算
        item: weightedRandom().add("iceandfire:pixie_dust", 1),
        count: 3,
    },
});

structureData.put("minecraft:monument", {
    gateway: "kubejs:misc/monument",
    name: "kubejs.recipeinfo.conquest.monument",
    description: "kubejs.recipeinfo.conquest.monument.description",
    mobs: monumentMobs,
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:prismarine_shard", 3)
            .add("minecraft:cod", 3)
            .add("minecraft:pufferfish", 2)
            .add("minecraft:prismarine_crystals", 2)
            .add("minecraft:turtle_egg", 1)
            .add("minecraft:sponge", 0.2)
            .add("dragonsurvival:elder_dragon_bone", 0.5)
            .add("dragonsurvival:heart_element", 0.2),
        count: 12,
    },
});

structureData.put("dragonsurvival:dragon_hunters_castle", {
    gateway: "kubejs:misc/dragon_hunters_castle",
    name: "kubejs.recipeinfo.conquest.dragon_hunters_castle",
    description: "kubejs.recipeinfo.conquest.dragon_hunters_castle.description",
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:iron_ingot", 1)
            .add("minecraft:diamond", 1)
            .add("dragonsurvival:elder_dragon_dust", 1)
            .add("dragonsurvival:elder_dragon_bone", 0.5)
            .add("dragonsurvival:heart_element", 0.2)
            .add("dragonsurvival:weak_dragon_heart", 0.1)
            .add("dragonsurvival:elder_dragon_heart", 0.1),
        count: 12,
    },
});

structureData.put("minecraft:ancient_city", {
    gateway: "kubejs:misc/ancient_city",
    name: "kubejs.recipeinfo.conquest.ancient_city",
    description: "kubejs.recipeinfo.conquest.ancient_city.description",
    mobs: commonMonsters,
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:sculk", 6)
            .add("minecraft:experience_bottle", 2)
            .add("minecraft:echo_shard", 2)
            .add("minecraft:amethyst_shard", 2)
            .add("irons_spellbooks:arcane_essence", 2)
            .add("irons_spellbooks:common_ink", 0.5)
            .add("irons_spellbooks:uncommon_ink", 0.3)
            .add("irons_spellbooks:rare_ink", 0.2)
            .add("dragonsurvival:elder_dragon_bone", 0.5)
            .add("dragonsurvival:heart_element", 0.2)
            .add("dragonsurvival:weak_dragon_heart", 0.1)
            .add("dragonsurvival:elder_dragon_heart", 0.1),
        count: 24,
    },
});

structureData.put("minecraft:bastion_remnant", {
    gateway: "kubejs:nether/bastion_remnant",
    name: "kubejs.recipeinfo.conquest.bastion_remnant",
    description: "kubejs.recipeinfo.conquest.bastion_remnant.description",
    mobs: netherMonsters,
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:gold_ingot", 3)
            .add("minecraft:gold_block", 1)
            .add("minecraft:diamond", 3)
            .add("minecraft:netherite_scrap", 2)
            .add("dragonsurvival:elder_dragon_bone", 0.5)
            .add("dragonsurvival:heart_element", 0.2)
            .add("dragonsurvival:weak_dragon_heart", 0.1)
            .add("dragonsurvival:elder_dragon_heart", 0.1),
        count: 16,
    },
});

structureData.put("minecraft:fortress", {
    gateway: "kubejs:nether/fortress",
    name: "kubejs.recipeinfo.conquest.fortress",
    description: "kubejs.recipeinfo.conquest.fortress.description",
    mobs: netherMonsters,
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:gold_ingot", 4)
            .add("minecraft:blaze_rod", 2)
            .add("minecraft:coal", 2)
            .add("minecraft:netherite_scrap", 1)
            .add("minecraft:wither_skeleton_skull", 0.1)
            .add("dragonsurvival:elder_dragon_bone", 0.5)
            .add("dragonsurvival:heart_element", 0.2)
            .add("dragonsurvival:weak_dragon_heart", 0.1)
            .add("dragonsurvival:elder_dragon_heart", 0.1),
        count: 16,
    },
});

structureData.put("irons_spellbooks:ancient_battleground", {
    gateway: "kubejs:nether/ancient_battleground",
    name: "kubejs.recipeinfo.conquest.ancient_battleground",
    description: "kubejs.recipeinfo.conquest.ancient_battleground.description",
    mobs: netherMonsters,
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:quartz", 4)
            .add("minecraft:netherite_scrap", 2)
            .add("irons_spellbooks:arcane_essence", 2)
            .add("irons_spellbooks:cinder_essence", 1)
            .add("irons_spellbooks:common_ink", 0.5)
            .add("irons_spellbooks:uncommon_ink", 0.2)
            .add("irons_spellbooks:rare_ink", 0.1)
            .add("dragonsurvival:elder_dragon_bone", 0.5)
            .add("dragonsurvival:heart_element", 0.2)
            .add("dragonsurvival:weak_dragon_heart", 0.1)
            .add("dragonsurvival:elder_dragon_heart", 0.1),
        count: 16,
    },
});

global.STRUCTURE_DATA = structureData;

//initStructureData();

// weightedRandom()
//             .add("minecraft:emerald", 2).items.keys()

//经验修补书 'minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:mending":1}}]'

// new Map([
//     ["skyvillages:skyvillage", {
//         gateway: "kubejs:village/sky_village",
//         name: "kubejs.recipeinfo.conquest.sky_village",
//         description: "kubejs.recipeinfo.conquest.sky_village.description",
//         product: { //每日结算
//             item: weightedRandom()
//                 .add("minecraft:emerald", 2)
//                 .add("minecraft:iron_ingot", 1)
//                 .add("minecraft:gold_ingot", 2)
//                 .add("dragonsurvival:elder_dragon_dust", 1),
//             count: 3
//         }
//     }]
// ])
//.get().product.item.items.
