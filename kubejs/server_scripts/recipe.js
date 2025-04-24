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
});
