// LootJS.lootTables((event) => {
//     event
//         .getLootTable("minecraft:chests/village/village_cartographer")
//         .firstPool()
//         .addEntry(
//             LootEntry.of("iceandfire:manuscript").withWeight(1).setCount([1, 2])
//         );
// });

LootJS.lootTables((event) => {
    event
        .getLootTable(
            "irons_spellbooks:chests/additional_library_loot"
        )
        .firstPool()
        .addEntry(
            LootEntry.of("iceandfire:manuscript").withWeight(1).setCount([2, 6])
        );
    event
        .getLootTable(
            "irons_spellbooks:chests/bookshelf_loot"
        )
        .firstPool()
        .addEntry(
            LootEntry.of("iceandfire:manuscript").withWeight(12).setCount([2, 5])
        );
    event
        .getLootTable(
            "irons_spellbooks:chests/priest_house"
        )
        .firstPool()
        .addEntry(
            LootEntry.of("iceandfire:manuscript").withWeight(2).setCount([1, 2])
        );
    event
        .getLootTable(
            "irons_spellbooks:chests/pyromancer_tower/burnt_chest"
        )
        .firstPool()
        .addEntry(
            LootEntry.of("iceandfire:manuscript").withWeight(2).setCount([1, 2])
        );
    event
        .getLootTable(
            "irons_spellbooks:chests/mangrove_hut"
        )
        .firstPool()
        .addEntry(
            LootEntry.of("iceandfire:manuscript").withWeight(2).setCount([1, 2])
        );
    event
        .getLootTable(
            "irons_spellbooks:chests/mountain_tower/mountain_tower"
        )
        .firstPool()
        .addEntry(
            LootEntry.of("iceandfire:manuscript").withWeight(2).setCount([1, 2])
        );
    event
        .getLootTable(
            "irons_spellbooks:chests/catacombs/pot"
        )
        .firstPool()
        .addEntry(
            LootEntry.of("iceandfire:manuscript").withWeight(2).setCount([1, 4])
        );
    event
        .getLootTable(
            "irons_spellbooks:chests/evoker_fort"
        )
        .firstPool()
        .addEntry(
            LootEntry.of("iceandfire:manuscript").withWeight(2).setCount([1, 4])
        );
});