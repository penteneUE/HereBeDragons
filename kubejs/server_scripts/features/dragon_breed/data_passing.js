//const $Map = Java.loadClass("java.util.Map");

//let $ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity");

//let $Set = Java.loadClass("java.util.HashSet");
// STR: Strength;
// DEX: Dexterity;
// CON: Constitution;

/**
 *
 * @param {string} color
 */
function eggColorToDragonType(color) {
    let col = color.toLowerCase();
    switch (col) {
        case "red":
        case "green":
        case "bronze":
        case "gray":
            return "iceandfire:fire_dragon";
        case "sapphire":
        case "white":
        case "blue":
        case "silver":
            return "iceandfire:ice_dragon";
        case "electric":
        case "amethyst":
        case "copper":
        case "black":
            return "iceandfire:lightning_dragon";
    }
}

/**
 * @type {$HashMap_<$UUID_, {customData: $CompoundTag_}>}
 */
const placedEggMap = Utils.newMap();

/**
 * @type {$HashMap_<$UUID_, {live: boolean, customData: $CompoundTag_, block: $BlockContainerJS_, variant: string}>} 龙蛋UUID对应玩家UUID、存活状态与data
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
    // let testTag = new $CompoundTag();
    // testTag.putString("hello", "world");
    // item.setCustomData(testTag);
    //item.setCustomName("HelloWorld");
    //console.log(item.customData);
    //console.log(item.id.match(/(?<=iceandfire:dragonegg_)[a-zA-Z]*/gm)[0]);
    // let tag = new $CompoundTag();
    // tag.put(BREED_DATA_KEY, item.customData);
    placedEggMap[event.player.uuid] = {
        customData: item.customData,
        live: true,
        block: event.block,
        //variant: item.id.match(/(?<=iceandfire:dragonegg_)[a-zA-Z]*/gm)[0],
        // ownerUUID:
    };
});

/**
 *
 * @param {$EntitySpawnedKubeEvent_ & {entity: $EntityDragonEgg_}} event
 */
function onDragonEggSpawn(event) {
    let { entity } = event;
    if (entity.level.isClientSide()) return;
    if (entity.persistentData[BREED_DATA_KEY]) return;

    // let $EntityDragonBase = Java.loadClass(
    //     "com.iafenvoy.iceandfire.entity.EntityDragonBase"
    // );
    let ownerUUID = entity.nbt.getString("OwnerUUID");

    let placedEggData = placedEggMap.getOrDefault(ownerUUID, null);
    if (placedEggData != null) {
        entity.persistentData.put(BREED_DATA_KEY, placedEggData.customData);
        placedEggMap.remove(ownerUUID);
        return;
    }

    let oAABB = entity.getBoundingBox().inflate(8);

    /** @type {$EntityDragonBase_ | null} */
    let father = null;

    /** @type {$EntityDragonBase_ | null} */
    let mother = null;

    let color = entity.nbt.getString("Color");
    //console.log(color);

    entity.level.getEntitiesWithin(oAABB).forEach((e) => {
        //if (!(e instanceof $EntityDragonBase)) return;
        if (e.type != eggColorToDragonType(color)) return;
        if (e.nbt.getBoolean("Gender")) {
            if (!father) father = e;
        } else {
            if (!mother) mother = e;
        }
    });

    //console.log(father);
    //console.log(mother);

    if (!father || !mother) {
        let $Entity$RemovalReason = Java.loadClass(
            "net.minecraft.world.entity.Entity$RemovalReason"
        );
        event.server.tell(
            "龙蛋繁殖失败 - 无法找到父母！请截图报告开发者，附上此刻情况。"
        );
        entity.remove($Entity$RemovalReason.DISCARDED);
    }

    entity.persistentData.put(
        BREED_DATA_KEY,
        getChildBreedData(
            entity.random,
            getBreedDataFromDragon(father),
            getBreedDataFromDragon(mother)
        )
    );

    // let eggTag = new $CompoundTag();
    // eggTag.putString(
    //     "OwnerUUID",
    //     mother.nbt.get("Owner") ?? father.nbt.get("Owner")
    // );

    entity.setOwnerId(
        mother.nbt.getUUID("Owner") ?? father.nbt.getUUID("Owner")
    );

    // event.server.scheduleInTicks(1, () => {
    //     entity.mergeNbt(eggTag);
    // });
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
//     console.log(entity.persistentData.get(BREED_DATA_KEY));
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
    if (entity.persistentData[BREED_DATA_KEY]) return;

    let oAABB = entity.getBoundingBox().inflate(0, 2, 0);

    /** @type {$Entity_ | null} */
    let egg = null;
    entity.level.getEntitiesWithin(oAABB).forEach((e) => {
        if (egg) return;
        if (e.type == "iceandfire:dragon_egg") egg = e;
    });

    if (!egg) return;

    entity.persistentData.put(
        BREED_DATA_KEY,
        egg.persistentData.get(BREED_DATA_KEY)
    );

    eggDataMap.remove(egg.getUuid().toString());
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
    event.server.scheduleInTicks(2, () => {
        /**
         * @type {{ownerUUID: $UUID_, live: boolean, customData: $CompoundTag_, block: $BlockContainerJS_} | null}
         */
        let found = null;
        let eggUUID = "";
        eggDataMap.forEach((key, value) => {
            if (value.live) return;
            if (!value.block.pos.closerThan(entity.block.pos, 8)) return;
            if (!itemEntity.item.is(`iceandfire:dragonegg_${value.variant}`))
                return;
            found = value;
            eggUUID = key;
        });
        if (!found) return;
        //entity.server.tell(found);
        //console.log(found);
        itemEntity.item.setCustomData(found.customData.get(BREED_DATA_KEY));

        //console.log(itemEntity.item.getCustomData());

        eggDataMap.remove(eggUUID);
    });

    // console.log(found.variant);
    // console.log();
    // console.log(entity.block.pos);
    // console.log(found.block.pos == entity.block.pos);
    // console.log();
});

// const $BabyEntitySpawnEvent = Java.loadClass(
//     "net.neoforged.neoforge.event.entity.living.BabyEntitySpawnEvent"
// );

// NativeEvents.onEvent($BabyEntitySpawnEvent, (event) => {
//     console.log(event.getParentA());
//     console.log(event.getParentB());
// });

// PlayerEvents.inventoryChanged((event) => {
//     let { item, player, entity } = event;

//     if (!item.hasTag("kubejs:dragon_eggs")) return;
//     //entity.server.tell(playerEggIDMap);
//     //entity.server.tell(eggDataMap);

//     //if (!playerEggIDMap.containsKey(player.getUuid().toString())) return;
//     // if (!eggDataMap.containsKey(playerEggIDMap[player.getUuid().toString()]))
//     //     return;

//     /**
//      * @type {{ownerUUID: $UUID_, live: boolean, customData: $CompoundTag_, block: $BlockContainerJS_} | null}
//      */
//     let found = null;
//     let eggUUID = "";
//     eggDataMap.forEach((key, value) => {
//         if (value.live) return;
//         if (!value.block.pos.closerThan(player.block.pos, 16)) return;
//         if (!item.is(`iceandfire:dragonegg_${value.variant}`)) return;
//         found = value;
//         eggUUID = key;
//     });
//     if (!found) return;
//     //entity.server.tell(found);
//     console.log(found);
//     item.setCustomData(found.customData.get(BREED_DATA_KEY));
//     console.log(item.getCustomData());

//     eggDataMap.remove(eggUUID);
//     //event.server.tell("111");
// });
