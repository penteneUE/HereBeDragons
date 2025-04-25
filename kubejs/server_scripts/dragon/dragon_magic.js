let $DragonStateHandler = Java.loadClass(
    "by.dragonsurvivalteam.dragonsurvival.common.capability.DragonStateHandler"
);
let $DragonStateProvider = Java.loadClass(
    "by.dragonsurvivalteam.dragonsurvival.common.capability.DragonStateProvider"
);

const ATTR_UUID = "bf435515-2a7b-4790-a937-bfbd843db62b";

const FIRE_SPELL_POWER = "irons_spellbooks:fire_spell_power";
const FIRE_SPELL_RESIST = "irons_spellbooks:fire_magic_resist";

const ICE_SPELL_POWER = "irons_spellbooks:ice_spell_power";
const ICE_SPELL_RESIST = "irons_spellbooks:ice_magic_resist";

const NATURE_SPELL_POWER = "irons_spellbooks:nature_spell_power";
const NATURE_SPELL_RESIST = "irons_spellbooks:nature_magic_resist";

const LIGHTNING_SPELL_POWER = "irons_spellbooks:lightning_spell_power";
const LIGHTNING_SPELL_RESIST = "irons_spellbooks:lightning_magic_resist";

const MAX_MANA = "irons_spellbooks:max_mana";

const DRAGONS = [
    "dragonsurvival:cave_dragon",
    "dragonsurvival:sea_dragon",
    "dragonsurvival:forest_dragon",
];

/**
 *
 * @param {$Player_} player
 */
function isDragon(player) {
    let handler = $DragonStateProvider.getData(player);

    return handler.isDragon();
}

function playerTick_DragonState(/**@type {$SimplePlayerKubeEvent_}*/ event) {
    const { player } = event;
    let handler = $DragonStateProvider.getData(player);

    if (player.stages.has("disablehuman")) {
        if (handler instanceof $DragonStateHandler && !handler.isDragon()) {
            let random_dragon =
                DRAGONS[Math.floor(Math.random() * DRAGONS.length)];
            e.server.runCommandSilent(
                `/execute as ${player.name.getString()} run dragon ${random_dragon}`
            );
        }
    }

    const attrTable = new Map();

    if (handler instanceof $DragonStateHandler && handler.isDragon()) {
        switch (handler.speciesId()) {
            case "dragonsurvival:forest_dragon":
                attrTable.set(NATURE_SPELL_POWER, 0.5);
                attrTable.set(FIRE_SPELL_POWER, -0.25);
                attrTable.set(ICE_SPELL_POWER, -0.25);

                attrTable.set(NATURE_SPELL_RESIST, 0.8);
                break;
            case "dragonsurvival:cave_dragon":
                attrTable.set(FIRE_SPELL_POWER, 0.5);
                attrTable.set(ICE_SPELL_POWER, -0.5);

                attrTable.set(FIRE_SPELL_RESIST, 0.8);
                break;
            case "dragonsurvival:sea_dragon":
                attrTable.set(LIGHTNING_SPELL_POWER, 0.25);
                attrTable.set(ICE_SPELL_POWER, 0.25);
                attrTable.set(FIRE_SPELL_POWER, -0.5);

                attrTable.set(LIGHTNING_SPELL_RESIST, 0.4);
                attrTable.set(ICE_SPELL_RESIST, 0.4);
                break;
        }

        let growth = handler.getGrowth();
        console.log(growth);

        if (growth > 120) {
            attrTable.set(MAX_MANA, 400);
        } else if (growth > 60) {
            attrTable.set(MAX_MANA, 200);
        } else if (growth > 45) {
            attrTable.set(MAX_MANA, 100);
        } else if (growth > 25) {
            attrTable.set(MAX_MANA, 50);
        }
    }

    attrTable.forEach((power, school, map) => {
        player.modifyAttribute(
            school, //Select max_health attribute
            ATTR_UUID, //Identifier (UUID)
            power,
            "add_value"
        ); //Operation
    });
}
