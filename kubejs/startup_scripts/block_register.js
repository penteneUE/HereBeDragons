StartupEvents.registry('block', event => {
  event.create('dragon_flag') // Create a new block
    .soundType('wool') // Set a material (affects the sounds and some properties)
    .hardness(1.0) // Set hardness (affects mining time)
    .resistance(3.0) // Set resistance (to explosions, etc)
    .requiresTool(true) // Requires a tool or it won't drop (see tags below)
    .tagBlock('minecraft:mineable/axe') //can be mined faster with an axe
    .tagBlock('minecraft:mineable/pickaxe') // or a pickaxe
    .tagBlock('minecraft:mineable/shovel') // or a pickaxe
    .tagBlock('forge:needs_gold_tool') // the tool tier must be at least iron
  
//   event.create('dragon_flag_active') // Create a new block
//     .soundType('wool') // Set a material (affects the sounds and some properties)
//     .hardness(1.0) // Set hardness (affects mining time)
//     .resistance(3.0) // Set resistance (to explosions, etc)
//     .requiresTool(true) // Requires a tool or it won't drop (see tags below)
//     .tagBlock('minecraft:mineable/axe') //can be mined faster with an axe
//     .tagBlock('minecraft:mineable/pickaxe') // or a pickaxe
//     .tagBlock('minecraft:mineable/shovel') // or a pickaxe
//     .tagBlock('forge:needs_gold_tool') // the tool tier must be at least iron
})