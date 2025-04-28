StartupEvents.registry("block", (event) => {
    event
        .create("dragon_flag")
        .soundType("wool")
        .hardness(3.0)
        .resistance(3.0)
        .requiresTool(true)
        .tagBlock("minecraft:mineable/axe")
        .tagBlock("minecraft:mineable/pickaxe")
        .tagBlock("minecraft:mineable/shovel")
        .tagBlock("minecraft:needs_stone_tool");

    event
        .create("endless_undead_flag")
        .soundType("wool")
        .hardness(3.0)
        .resistance(3.0)
        .requiresTool(true)
        .tagBlock("minecraft:mineable/axe")
        .tagBlock("minecraft:mineable/pickaxe")
        .tagBlock("minecraft:mineable/shovel")
        .tagBlock("minecraft:needs_diamond_tool");

    event
        .create("endless_myth_flag")
        .soundType("wool")
        .hardness(3.0)
        .resistance(3.0)
        .requiresTool(true)
        .tagBlock("minecraft:mineable/axe")
        .tagBlock("minecraft:mineable/pickaxe")
        .tagBlock("minecraft:mineable/shovel")
        .tagBlock("minecraft:needs_diamond_tool");

    event
        .create("endless_titan_flag")
        .soundType("wool")
        .hardness(3.0)
        .resistance(3.0)
        .requiresTool(true)
        .tagBlock("minecraft:mineable/axe")
        .tagBlock("minecraft:mineable/pickaxe")
        .tagBlock("minecraft:mineable/shovel")
        .tagBlock("minecraft:needs_diamond_tool");

    event
        .create("endless_dragon_flag")
        .soundType("wool")
        .hardness(3.0)
        .resistance(3.0)
        .requiresTool(true)
        .tagBlock("minecraft:mineable/axe")
        .tagBlock("minecraft:mineable/pickaxe")
        .tagBlock("minecraft:mineable/shovel")
        .tagBlock("minecraft:needs_diamond_tool");

    event
        .create("tax_collector", "custommachinery")
        .machine("kubejs:tax_collector");
    //.opaque(false)
    //.fullBlock(false)
    //.notSolid()
    //.box(4, 0, 4, 12, 12, 12, true)
    // .glassSoundType()
    // .hardness(3.0)
    // .resistance(3.0)
    // .requiresTool(true)
    // .tagBlock('minecraft:mineable/axe')
    // .tagBlock('minecraft:mineable/pickaxe')
    // .tagBlock('minecraft:mineable/shovel')
    // .tagBlock('minecraft:needs_stone_tool')

    //   event.create('dragon_flag_active') // Create a new block
    //     .soundType('wool') // Set a material (affects the sounds and some properties)
    //     .hardness(1.0) // Set hardness (affects mining time)
    //     .resistance(3.0) // Set resistance (to explosions, etc)
    //     .requiresTool(true) // Requires a tool or it won't drop (see tags below)
    //     .tagBlock('minecraft:mineable/axe') //can be mined faster with an axe
    //     .tagBlock('minecraft:mineable/pickaxe') // or a pickaxe
    //     .tagBlock('minecraft:mineable/shovel') // or a pickaxe
    //     .tagBlock('forge:needs_gold_tool') // the tool tier must be at least iron
});
