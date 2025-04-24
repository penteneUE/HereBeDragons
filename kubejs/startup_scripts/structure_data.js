function weightedRandom() {
    let builder = {
        items: new Map(),
        /**
         * @param {any} item
         * @param {number} weight
         */
        add: function (item, weight) {
            builder.items.set(item, weight);
            return builder;
        },
        getItem: function () {
            const items = Array.from(this.items);
            //var pmf = [0.8, 0.1, 0.1];
            //var pmf = Array.from(items.values())
            //var cdf = pmf.map((sum => value => sum += value)(0));
            let total = 0.0;
            items.forEach((record) => {
                total += record[1];
            });

            let max = items[0][1];
            let random = Math.random() * total;

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

global.UTILS = {
    weightedRandom: weightedRandom,
};

const structureData = Utils.newMap();

structureData.put("skyvillages:skyvillage", {
    gateway: "kubejs:village/sky_village",
    name: "kubejs.recipeinfo.conquest.sky_village",
    description: "kubejs.recipeinfo.conquest.sky_village.description",
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
            .add("dragonsurvival:elder_dragon_dust", 1),
        count: 6,
    },
};

const mediumVillageData = {
    gateway: "kubejs:village/medium_village",
    name: "kubejs.recipeinfo.conquest.medium_village",
    description: "kubejs.recipeinfo.conquest.medium_village.description",
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
            .add("dragonsurvival:elder_dragon_dust", 1)
            .add("dragonsurvival:heart_element", 0.5)
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
            .add("dragonsurvival:elder_dragon_dust", 1)
            .add("dragonsurvival:heart_element", 0.5)
            .add("dragonsurvival:weak_dragon_heart", 0.25)
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
    product: {
        //每日结算
        item: weightedRandom()
            .add("minecraft:pufferfish", 1)
            .add("minecraft:cod", 2)
            .add("minecraft:salmon", 2)
            .add("minecraft:kelp", 2)
            .add("minecraft:ink_sac", 2),
        count: 8,
    },
};

Array.of("minecraft:shipwreck", "minecraft:shipwreck_beached").forEach(
    (structure) => {
        structureData.put(structure, shipwreckData);
    }
);
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

global.STRUCTURE_DATA = structureData;
//.get().product.item.items.
