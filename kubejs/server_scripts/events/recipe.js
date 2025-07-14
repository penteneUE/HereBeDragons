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

    event.shaped(Item.of("kubejs:gene_holder"), ["ABA", "ACA", "ABA"], {
        A: "#minecraft:meat",
        B: "dragonsurvival:elder_dragon_bone",
        C: "#kubejs:holdable_skulls",
    });

    event.shaped(Item.of("kubejs:lilliput_cloak"), ["AAA", "ABA", "C C"], {
        A: "minecraft:rabbit_hide",
        B: "iceandfire:ectoplasm",
        C: "dragonsurvival:elder_dragon_dust",
    });

    event.shaped(Item.of("kubejs:brobdingnag_cloak"), ["AAA", "ABA", "C C"], {
        A: "irons_spellbooks:hogskin",
        B: "iceandfire:cyclops_eye",
        C: "dragonsurvival:elder_dragon_bone",
    });

    event.shaped(
        Item.of("kubejs:gene_seeker"),
        [
            " AB",
            " CA",
            "A  ", // 111
        ],
        {
            A: "iceandfire:silver_ingot",
            B: "dragonsurvival:elder_dragon_heart",
            C: "#kubejs:holdable_skulls",
        }
    );
    event.shaped(
        Item.of("kubejs:gene_splicer"),
        [
            "  A",
            "BC ",
            "DE ", // 111
        ],
        {
            A: "irons_spellbooks:heavy_chain_necklace",
            B: "iceandfire:summoning_crystal_fire",
            C: "kubejs:gene_seeker",
            D: "iceandfire:summoning_crystal_lightning",
            E: "iceandfire:summoning_crystal_ice",
        }
    );

    event
        .shapeless(
            Item.of("wooden_axe", 1).withCustomName(
                Text.lightPurple({ translate: "kubejs.recipe.imbue_gene" })
            ), // arg 1: output
            [
                Ingredient.of("kubejs:gene_splicer"),
                Ingredient.of("kubejs:gene_holder"),
            ]
        )
        .modifyResult("kubejs/gene_splicer_fill");
});

ServerEvents.modifyRecipeResult("kubejs/gene_splicer_fill", (event) => {
    let { grid, item } = event;

    let output = grid.find(Ingredient.of("kubejs:gene_splicer"));
    let holder = grid.find(Ingredient.of("kubejs:gene_holder"));

    if (!holder.customData || holder.customData.empty) {
        // console.log("111");
        item.setCount(0);
        event.cancel();
        event.exit();
        return Item.of("minecraft:air");
    }
    item = output;
    output.setCustomData(getBreedDataFromItem(holder));

    event.success(output);
    return output;
});
