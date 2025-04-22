let $DragonStateHandler = Java.loadClass("by.dragonsurvivalteam.dragonsurvival.common.capability.DragonStateHandler");
let $DragonStateProvider = Java.loadClass("by.dragonsurvivalteam.dragonsurvival.common.capability.DragonStateProvider");

const ATTR_UUID = "bf435515-2a7b-4790-a937-bfbd843db62b"

const FIRE_SPELL_POWER = "irons_spellbooks:fire_spell_power"
const FIRE_SPELL_RESIST = "irons_spellbooks:fire_magic_resist"

const ICE_SPELL_POWER = "irons_spellbooks:ice_spell_power"
const ICE_SPELL_RESIST = "irons_spellbooks:ice_magic_resist"

const NATURE_SPELL_POWER = "irons_spellbooks:nature_spell_power"
const NATURE_SPELL_RESIST = "irons_spellbooks:nature_magic_resist"

const LIGHTNING_SPELL_POWER = "irons_spellbooks:lightning_spell_power"
const LIGHTNING_SPELL_RESIST = "irons_spellbooks:lightning_magic_resist"

const DRAGONS = ['dragonsurvival:cave_dragon', 'dragonsurvival:sea_dragon', 'dragonsurvival:forest_dragon'];
 
PlayerEvents.tick(e => {
    const { player } = e;
    let handler = $DragonStateProvider.getData(player);

    if (player.stages.has("disablehuman")) {
        if (handler instanceof $DragonStateHandler && !handler.isDragon()) {
            let random_dragon = DRAGONS[Math.floor(Math.random() * DRAGONS.length)];
            e.server.runCommandSilent(`/execute as ${player.name.getString()} run dragon ${random_dragon}`)
        }
    }

    const attrTable = new Map();

    if (handler instanceof $DragonStateHandler && handler.isDragon()) {
        switch (handler.speciesId()) {
            case "dragonsurvival:forest_dragon":
                attrTable.set(NATURE_SPELL_POWER, 0.5)
                attrTable.set(FIRE_SPELL_POWER, -0.25)
                attrTable.set(ICE_SPELL_POWER, -0.25)

                attrTable.set(NATURE_SPELL_RESIST, 0.8)
                break;
            case "dragonsurvival:cave_dragon":
                attrTable.set(FIRE_SPELL_POWER, 0.5)
                attrTable.set(ICE_SPELL_POWER, -0.5)

                attrTable.set(FIRE_SPELL_RESIST, 0.8)
                break;
            case "dragonsurvival:sea_dragon":
                attrTable.set(LIGHTNING_SPELL_POWER, 0.25)
                attrTable.set(ICE_SPELL_POWER, 0.25)
                attrTable.set(FIRE_SPELL_POWER, -0.5)

                attrTable.set(LIGHTNING_SPELL_RESIST, 0.4)
                attrTable.set(ICE_SPELL_RESIST, 0.4)
                break;
        }
    }
    
    attrTable.forEach((power, school, map) => {
        player.modifyAttribute(school, //Select max_health attribute
            ATTR_UUID, //Identifier (UUID)
            power
            ,"add_value") //Operation
    })
    
 })

// PlayerEvents.tick(e => {
//     const { player } = e;

//     // Reset logic if effect is not active
//     if (!player.potionEffects.isActive('minecraft:slowness')) {
//         player.modifyAttribute("minecraft:generic.max_health", //Select max_health attribute
//             "bf435515-2a7b-4790-a937-bfbd843db62b", //Identifier (UUID)
//             0 //reset
//             ,"add_value") //Operation

//         //Update player health
//         player.setHealth(player.getHealth())
//         return;
//     }
//     else{

//         player.modifyAttribute("minecraft:generic.max_health", //Select max_health attribute
//             "bf435515-2a7b-4790-a937-bfbd843db62b", //Identifier (UUID)
//             -1 //Modify attribute to be at least 1 hp
//             ,"add_value") //Operation
    
//         //Update player health
//         player.setHealth(Math.min(player.getHealth(),player.getMaxHealth()))
//     }

// });