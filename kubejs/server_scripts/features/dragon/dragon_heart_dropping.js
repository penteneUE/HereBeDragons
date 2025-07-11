let $DragonStateHandler = Java.loadClass(
    "by.dragonsurvivalteam.dragonsurvival.common.capability.DragonStateHandler"
);
let $DragonStateProvider = Java.loadClass(
    "by.dragonsurvivalteam.dragonsurvival.common.capability.DragonStateProvider"
);

/**
 * @type {import("java.util.List").$List<import("net.minecraft.world.entity.Entity").$Entity$$Type>}
 */
let dragonHunterList = Utils.newList();
dragonHunterList.addAll([
    "dragonsurvival:hunter_hound",
    "dragonsurvival:hunter_griffin",
    "dragonsurvival:hunter_spearman",
    "dragonsurvival:hunter_knight",
    "dragonsurvival:hunter_ambusher",
    "dragonsurvival:hunter_leader",
]);

/**
 *
 * @param {$Player_} dragonPlayer
 */
function dropDragonHeart(dragonPlayer) {
    let handler = $DragonStateProvider.getData(dragonPlayer);
    /**
     * @type {$ItemStack_}
     */
    let item;

    switch (handler.speciesId()) {
        case "dragonsurvival:forest_dragon":
            item = Item.of("kubejs:forest_dragon_heart");
            break;
        case "dragonsurvival:cave_dragon":
            item = Item.of("kubejs:cave_dragon_heart");
            break;
        case "dragonsurvival:sea_dragon":
            item = Item.of("kubejs:sea_dragon_heart");
            break;
        default:
            return;
    }

    dragonPlayer.block.popItem(item);
}

EntityEvents.death("minecraft:player", (event) => {
    let {
        player,
        source,
        source: { actual },
    } = event;
    //console.log(111);
    if (!actual) return;
    if (!global.UTILS.isDragon(player)) return;
    //console.log(actual);
    if (actual.isPlayer()) {
        if (global.UTILS.isDragon(actual)) return;
        dropDragonHeart(player);
        return;
    }

    if (!dragonHunterList.contains(actual.type)) return;
    dropDragonHeart(player);
    //player.removeEffect("dragonsurvival:hunter_omen")
    //console.log("222");
});
