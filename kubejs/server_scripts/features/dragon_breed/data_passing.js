//const $Map = Java.loadClass("java.util.Map");

//let $ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity");

//let $Set = Java.loadClass("java.util.HashSet");
/**
 * @type {$HashMap_<$UUID_, {customData: $CompoundTag_}>}
 */
const placedEggMap = Utils.newMap();

/**
 * @type {$HashMap_<$UUID_, {ownerUUID: $UUID_, live: boolean, customData: $CompoundTag_, block: $BlockContainerJS_}>} 龙蛋UUID对应玩家UUID、存活状态与data
 */
const eggDataMap = Utils.newMap();

// /**
//  * @type {$HashMap_<$UUID_, Set<$UUID_>>} 玩家UUID对应多个龙蛋UUID
//  */
// const playerEggIDMap = Utils.newMap();

BlockEvents.rightClicked((event) => {
    // let $EntityDragonEgg = Java.loadClass(
    //     "com.iafenvoy.iceandfire.entity.EntityDragonEgg"
    // );

    // console.log($EntityDragonEgg);
    // console.log($EntityDragonEgg.prototype);
    // //console.log($EntityDragonEgg.prototype.onDamageTaken);
    // console.log($EntityDragonEgg.)

    let { item } = event;
    if (!item.hasTag("kubejs:dragon_eggs")) return;
    let testTag = new $CompoundTag();
    testTag.putString("hello", "world");
    item.setCustomData(testTag);
    //item.setCustomName("HelloWorld");
    //console.log(item.customData);
    placedEggMap[event.player.uuid] = {
        customData: item.customData,
        live: true,
        block: event.block,
        // ownerUUID:
    };
});

/**
 *
 * @param {$EntitySpawnedKubeEvent_} event
 */
function onDragonEggSpawn(event) {
    let { entity } = event;
    if (entity.level.isClientSide()) return;

    let ownerUUID = entity.nbt.getString("OwnerUUID");
    if (!ownerUUID) return;

    let placedEggData = placedEggMap.getOrDefault(ownerUUID, null);
    if (!placedEggData) return;
    entity.persistentData.put("breed_data", placedEggData.customData);
    placedEggMap.remove(ownerUUID);
    //entity.persistentData = placedEggData.customData;
}

// /**
//  *
//  * @param {$LivingEntityDeathKubeEvent_} event
//  */
// function onDragonEggDeath(event) {
//     let { entity } = event;
//     //if (!entity.is("iceandfire:dragon_egg")) return;
//     //if (entity.level.isClientSide()) return;

//     // let ownerUUID = entity.nbt.getString("OwnerUUID");
//     // if (!ownerUUID) return;
//     entity.server.tell("111");
//     console.log(111);
//     console.log(entity.persistentData.get("breed_data"));
//     //entity.persistentData = placedEggData.customData;
// }

/**
 *
 * @param {$EntitySpawnedKubeEvent_} event
 */
function onDragonSpawn(event) {
    let { entity } = event;
    if (entity.level.isClientSide()) return;
    if (!isIAFDragon(entity)) return;

    let oAABB = entity.getBoundingBox().inflate(0, 2, 0);

    /** @type {$Entity_ | null} */
    let egg = null;
    entity.level.getEntitiesWithin(oAABB).forEach((e) => {
        if (egg) return;
        if (e.type == "iceandfire:dragon_egg") egg = e;
    });

    if (!egg) return;

    //entity.persistentData.putBoolean("hello_world", true);
}

EntityEvents.spawned("iceandfire:fire_dragon", onDragonSpawn);
EntityEvents.spawned("iceandfire:ice_dragon", onDragonSpawn);
EntityEvents.spawned("iceandfire:lightning_dragon", onDragonSpawn);

EntityEvents.spawned("iceandfire:dragon_egg", onDragonEggSpawn);

// const $LivingIncomingDamageEvent = Java.loadClass(
//     "net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent"
// );
// const $LivingDamageEvent$Post = Java.loadClass(
//     "net.neoforged.neoforge.event.entity.living.LivingDamageEvent$Post"
// );
const $LivingEvent$LivingTickEvent = Java.loadClass(
    "net.neoforged.neoforge.event.entity.living.LivingBreatheEvent"
);

// // EntityEvents.death(onDragonEggDeath);
// // EntityEvents.beforeHurt(onDragonEggDeath);
// // EntityEvents.afterHurt(onDragonEggDeath);

// NativeEvents.onEvent($LivingDamageEvent$Post, onDragonEggDeath);
NativeEvents.onEvent($LivingEvent$LivingTickEvent, (event) => {
    let { entity } = event;

    if (entity.level.isClientSide()) return;
    if (entity.type != "iceandfire:dragon_egg") return;

    if (!entity.alive) return;
    //entity.server.tell(eggDataMap);
    eggDataMap.putIfAbsent(entity.getUuid().toString(), {
        live: true,
        //ownerUUID: entity.nbt.getString("OwnerUUID"),
        customData: entity.persistentData,
        block: entity.block,
        variant: entity.nbt.getString("Color"),
    });
    eggDataMap[entity.getUuid().toString()].live = true;

    // playerEggIDMap.putIfAbsent(ownerUUID, new $Set());

    // playerEggIDMap[ownerUUID].add(entity.getUuid().toString());
});

ServerEvents.tick((event) => {
    if (event.server.tickCount % 2 != 0) return;

    eggDataMap.forEach((key, value) => {
        value.live = false;
    });
});

EntityEvents.spawned("minecraft:item", (event) => {
    let { entity } = event;
    //if (!(entity instanceof $ItemEntity)) return;
    /**
     * @type {import("net.minecraft.world.entity.item.ItemEntity").$ItemEntity}
     */
    let itemEntity = entity;

    if (!itemEntity.item.hasTag("kubejs:dragon_eggs")) return;
    //console.log(111);
    /**
     * @type {{ownerUUID: $UUID_, live: boolean, customData: $CompoundTag_, block: $BlockContainerJS_} | null}
     */
    let found = null;
    eggDataMap.forEach((key, value) => {
        if (value.live) return;
        if (!value.block.pos.closerThan(entity.block.pos, 5)) return;
        if (!itemEntity.item.is(`iceandfire:dragonegg_${value.variant}`))
            return;
        found = value;
    });
    if (!found) return;
    entity.server.tell(found);
    // console.log(found.variant);
    // console.log();
    // console.log(entity.block.pos);
    // console.log(found.block.pos == entity.block.pos);
    // console.log();
});

// PlayerEvents.inventoryChanged((event) => {
//     let { item, player } = event;

//     if (!item.hasTag("kubejs:dragon_eggs")) return;
//     entity.server.tell(playerEggIDMap);
//     entity.server.tell(eggDataMap);

//     //if (!playerEggIDMap.containsKey(player.getUuid().toString())) return;
//     if (!eggDataMap.containsKey(playerEggIDMap[player.getUuid().toString()]))
//         return;

//     //event.server.tell("111");
// });
// EntityEvents.drops((event) => {
//     let { entity } = event;
//     entity.server.tell("111");
//     console.log(entity);
// });
