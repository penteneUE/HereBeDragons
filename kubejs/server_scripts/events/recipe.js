ServerEvents.recipes((event) => {
    event.remove({ output: "gateways:gate_pearl" });
    event.remove({ output: "iceandfire:gold_pile" });
    event.remove({ output: "iceandfire:silver_pile" });
    event.remove({ output: "iceandfire:copper_pile" });
    //event.remove({ output: 'supplementaries:dragon_banner_pattern' })

    event.replaceInput(
        { output: "supplementaries:dragon_banner_pattern" },
        "minecraft:dragon_head",
        "dragonsurvival:elder_dragon_dust"
    );

    event.shapeless(
        Item.of("kubejs:dragon_flag", 2), // arg 1: output
        ["#minecraft:logs", "dragonsurvival:elder_dragon_dust"]
    );

    event.remove({
        output: "dragonsurvival:weak_dragon_heart",
        mod: "dragonsurvival",
    });

    event.shapeless(
        Item.of("dragonsurvival:weak_dragon_heart", 1), // arg 1: output
        [
            "dragonsurvival:heart_element",
            "dragonsurvival:heart_element",
            "dragonsurvival:heart_element",
            "dragonsurvival:heart_element",
            "dragonsurvival:heart_element",
            "dragonsurvival:heart_element",
            "dragonsurvival:heart_element",
            "dragonsurvival:heart_element",
            "dragonsurvival:heart_element",
        ]
    );

    event.shapeless(
        Item.of("dragonsurvival:weak_dragon_heart", 2), // arg 1: output
        ["dragonsurvival:elder_dragon_heart"]
    );

    event.smelting(
        "2x dragonsurvival:heart_element" /* 输出物品 */,
        "kubejs:cave_dragon_heart" /* 输入物品 */,
        10
    );
    event.blasting(
        "2x dragonsurvival:heart_element" /* 输出物品 */,
        "kubejs:cave_dragon_heart" /* 输入物品 */,
        10
    );

    event.smelting(
        "2x dragonsurvival:heart_element" /* 输出物品 */,
        "kubejs:forest_dragon_heart" /* 输入物品 */,
        10
    );
    event.blasting(
        "2x dragonsurvival:heart_element" /* 输出物品 */,
        "kubejs:forest_dragon_heart" /* 输入物品 */,
        10
    );

    event.smelting(
        "2x dragonsurvival:heart_element" /* 输出物品 */,
        "kubejs:sea_dragon_heart" /* 输入物品 */,
        10
    );
    event.blasting(
        "2x dragonsurvival:heart_element" /* 输出物品 */,
        "kubejs:sea_dragon_heart" /* 输入物品 */,
        10
    );

    event
        .shapeless(
            Item.of("kubejs:endless_undead_flag", 1), // arg 1: output
            ["minecraft:bone_block", "kubejs:paper_dragon_fragment"]
        )
        .keepIngredient("kubejs:paper_dragon_fragment");

    event
        .shapeless(
            Item.of("kubejs:endless_myth_flag", 1), // arg 1: output
            ["#minecraft:logs", "kubejs:paper_dragon_fragment"]
        )
        .keepIngredient("kubejs:paper_dragon_fragment");

    event
        .shapeless(
            Item.of("kubejs:endless_titan_flag", 1), // arg 1: output
            ["#c:cobblestones", "kubejs:paper_dragon_fragment"]
        )
        .keepIngredient("kubejs:paper_dragon_fragment");

    event
        .shapeless(
            Item.of("kubejs:endless_dragon_flag", 1), // arg 1: output
            ["iceandfire:dragon_bone_block", "kubejs:paper_dragon_fragment"]
        )
        .keepIngredient("kubejs:paper_dragon_fragment");

    event
        .shapeless(
            Item.of("kubejs:wet_sponge", 1), // arg 1: output
            ["kubejs:dry_sponge", "minecraft:water_bucket"]
        )
        .keepIngredient("minecraft:water_bucket");

    event.shapeless(
        Item.of("kubejs:dry_sponge", 16), // arg 1: output
        ["minecraft:sponge", "dragonsurvival:elder_dragon_dust"]
    );

    // event.shapeless(
    //     Item.of('supplementaries:dragon_banner_pattern', 1), // arg 1: output
    //     [
    //         'minecraft:paper',
    //         'dragonsurvival:elder_dragon_dust',
    //     ]
    // )
    event.shaped(
        Item.of("kubejs:tax_collector", 1), // arg 1: output
        [
            "ABA",
            "ACA", // arg 2: the shape (array of strings)
            "AAA",
        ],
        {
            A: "minecraft:glass",
            B: "dragonsurvival:elder_dragon_dust", //arg 3: the mapping object
            C: "minecraft:emerald",
        }
    );

    event.shaped(
        Item.of("kubejs:paper_dragon_egg", 1), // arg 1: output
        [
            "ABA",
            "BCB", // arg 2: the shape (array of strings)
            "ABA",
        ],
        {
            A: "minecraft:paper",
            B: "kubejs:paper_dragon_fragment", //arg 3: the mapping object
            C: "minecraft:nether_star",
        }
    );

    event.shaped(
        Item.of("kubejs:fire_dragon_stew", 1),
        [
            "ABC", //不加空行看看
            " D ",
        ],
        {
            A: "iceandfire:fire_dragon_flesh",
            B: "iceandfire:fire_dragon_heart",
            C: "iceandfire:fire_dragon_blood",
            D: "iceandfire:fire_stew",
        }
    );

    event.shaped(
        Item.of("kubejs:ice_dragon_stew", 1),
        [
            "ABC", //不加空行看看
            " D ",
        ],
        {
            A: "iceandfire:ice_dragon_flesh",
            B: "iceandfire:ice_dragon_heart",
            C: "iceandfire:ice_dragon_blood",
            D: "iceandfire:frost_stew",
        }
    );

    event.shaped(
        Item.of("kubejs:lightning_dragon_stew", 1),
        [
            "ABC", //不加空行看看
            " D ",
        ],
        {
            A: "iceandfire:lightning_dragon_flesh",
            B: "iceandfire:lightning_dragon_heart",
            C: "iceandfire:lightning_dragon_blood",
            D: "iceandfire:lightning_stew",
        }
    );
});
