//const $Map = Java.loadClass("java.util.Map");

//let $ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity");

//let $Set = Java.loadClass("java.util.HashSet");
// STR: Strength;
// DEX: Dexterity;
// CON: Constitution;

/**
 *
 * @param {string} color
 * @returns {"iceandfire:fire_dragon" | "iceandfire:ice_dragon" | "iceandfire:lightning_dragon"}
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
 *
 * @param {$EntityDragonEgg_} entity
 */
function isIceDragonEgg(entity) {
    return (
        eggColorToDragonType(entity.getEggType().name()) ==
        "iceandfire:ice_dragon"
    );
}

/**
 * @type {$HashMap_<$UUID_, {customData: $CompoundTag_}>}
 */
const eggPlacingMap = Utils.newMap();

/**
 * @typedef {object} PlacedEggData
 * @property {boolean} live
 * @property {$CompoundTag_} customData
 * @property {$BlockContainerJS_} block
 * @property {string} variant
 */

/**
 * @type {$HashMap_<$UUID_, PlacedEggData>} 龙蛋UUID对应玩家UUID、存活状态与data
 */
const placedEggMap = Utils.newMap();

// /**
//  * @type {$HashMap_<$UUID_, {live: boolean, customData: $CompoundTag_, block: $BlockContainerJS_, variant: string}>} 龙蛋UUID对应玩家UUID、存活状态与data
//  */
// const placedIceEggMap = Utils.newMap();

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
    if (item.getCustomData().empty)
        item.setCustomData(randomBreedData(event.entity.random));
    eggPlacingMap[event.player.uuid] = {
        customData: item.getCustomData(),
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

    let placedEggData = eggPlacingMap.getOrDefault(ownerUUID, null);
    if (placedEggData != null) {
        entity.persistentData.put(BREED_DATA_KEY, placedEggData.customData);
        eggPlacingMap.remove(ownerUUID);
        return;
    }

    if (isIceDragonEgg(entity)) {
        let data = popFrozenEggData(entity.server, entity);
        if (data) {
            entity.persistentData.put(BREED_DATA_KEY, data.get(BREED_DATA_KEY));
            placedEggMap.putIfAbsent(entity.getUuid().toString(), {
                live: true,
                customData: entity.persistentData,
                block: entity.block,
                variant: entity.nbt.getString("Color"),
            });
            return;
        }
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
        return;
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
 * @param {$EntitySpawnedKubeEvent_ & {entity: $EntityDragonBase_}} event
 */
function onDragonSpawn(event) {
    let { entity } = event;
    if (entity.level.isClientSide()) return;
    if (!isIAFDragon(entity)) return;
    if (entity.persistentData[BREED_DATA_KEY]) return;

    if (entity.type == "iceandfire:ice_dragon") {
        let data = popFrozenEggData(entity.server, entity);
        if (data) {
            entity.persistentData.put(BREED_DATA_KEY, data.get(BREED_DATA_KEY));
            return;
        }
    }

    let oAABB = entity.getBoundingBox().inflate(0, 2, 0);

    /** @type {$Entity_ | null} */
    let egg = null;
    entity.level.getEntitiesWithin(oAABB).forEach((e) => {
        if (egg) return;
        if (e.type != "iceandfire:dragon_egg") return;
        if (e.getEggType().name() != entity.getVariant()) return;
        egg = e;
    });

    if (egg) {
        entity.persistentData.put(
            BREED_DATA_KEY,
            egg.persistentData.get(BREED_DATA_KEY)
        );

        placedEggMap.remove(egg.getUuid().toString());
        return;
    }

    entity.persistentData.put(BREED_DATA_KEY, randomBreedData());
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
const $LivingBreatheEvent = Java.loadClass(
    "net.neoforged.neoforge.event.entity.living.LivingBreatheEvent"
);

// // EntityEvents.death(onDragonEggDeath);
// // EntityEvents.beforeHurt(onDragonEggDeath);
// // EntityEvents.afterHurt(onDragonEggDeath);

/**
 *
 * @param {$LivingBreatheEvent_} event
 */
function dragonEggTick(event) {
    let { entity } = event;
    if (!entity.alive) return;
    //entity.server.tell(eggDataMap);
    placedEggMap.putIfAbsent(entity.getUuid().toString(), {
        live: true,
        //ownerUUID: entity.nbt.getString("OwnerUUID"),
        customData: entity.persistentData,
        block: entity.block,
        variant: entity.nbt.getString("Color"),
    });
    placedEggMap[entity.getUuid().toString()].live = true;
}

// NativeEvents.onEvent($LivingDamageEvent$Post, onDragonEggDeath);
NativeEvents.onEvent($LivingBreatheEvent, (event) => {
    let { entity } = event;

    if (!entity) return;
    if (entity.level.isClientSide()) return;
    if (entity.type != "iceandfire:dragon_egg") return;

    dragonEggTick(event);
    // playerEggIDMap.putIfAbsent(ownerUUID, new $Set());

    // playerEggIDMap[ownerUUID].add(entity.getUuid().toString());
});

ServerEvents.tick((event) => {
    if (event.server.tickCount % 20 == 0) {
        /**
         * @type {import("java.util.List").$List<string>}
         */
        let keyListToRemove = Utils.newList();
        placedEggMap.forEach((key, value) => {
            if (value.live) return;
            if (eggColorToDragonType(value.variant) != "iceandfire:ice_dragon")
                return;
            if (
                value.block.id != "minecraft:water" &&
                value.block.id != "iceandfire:egginice"
            )
                return;
            if (
                value.block.level.getBlock(value.block.pos) !=
                "iceandfire:egginice"
            )
                return;
            freezeEggIntoPersistentData(event.server, value);
            keyListToRemove.add(key);
            //placedEggMap.remove(key);
        });
        if (!keyListToRemove.empty) {
            for (const key of keyListToRemove) {
                placedEggMap.remove(key);
            }
        }
        // DEBUG event.server.tell(event.server.persistentData);
        return;
    }
    if (event.server.tickCount % 2 == 0) {
        placedEggMap.forEach((key, value) => {
            value.live = false;
            // event.server.tell(value.block.id);
        });
        return;
    }
});

const FROZEN_EGG_DATA_KEY = "frozenDragonEggs";

/**
 * @param {PlacedEggData} data
 * @returns {$CompoundTag_}
 */
function freezeEggData(data) {
    let {
        block,
        block: {
            pos,
            pos: { x, y, z },
            dimension,
        },
        variant,
        customData,
    } = data;
    let tag = new $CompoundTag();

    tag.putInt("x", x);
    tag.putInt("y", y);
    tag.putInt("z", z);
    tag.putString("dimension", dimension);
    tag.putString("variant", variant);
    tag.put(BREED_DATA_KEY, customData.get(BREED_DATA_KEY));
    return tag;
}

/**
 *
 * @param {{persistentData: $CompoundTag_}} provider
 * @param {PlacedEggData} eggData
 */
function freezeEggIntoPersistentData(provider, eggData) {
    let { persistentData } = provider;

    if (persistentData.contains(FROZEN_EGG_DATA_KEY)) {
        persistentData[FROZEN_EGG_DATA_KEY].addLast(freezeEggData(eggData));
        return;
    }
    /**
     * @type {$ListTag_}
     */
    let tag = new $ListTag();

    tag.addLast(freezeEggData(eggData));
    persistentData.put(FROZEN_EGG_DATA_KEY, tag);
}

/**
 *
 * @param {{persistentData: $CompoundTag_}} provider
 * @param {$EntityDragonEgg_ | $EntityDragonBase_} entity
 * @returns {$CompoundTag_ | null}
 */
function popFrozenEggData(provider, entity) {
    let $EntityDragonBase = Java.loadClass(
        "com.iafenvoy.iceandfire.entity.EntityDragonBase"
    );
    let { persistentData } = provider;
    let {
        blockX,
        blockY,
        blockZ,
        block,
        block: { dimension },
    } = entity;
    if (
        !persistentData[FROZEN_EGG_DATA_KEY] ||
        persistentData[FROZEN_EGG_DATA_KEY].empty
    ) {
        return null;
    }
    /**
     * @type {$ListTag_ & $CompoundTag_[]}
     */
    let frozenDataList = persistentData.get(FROZEN_EGG_DATA_KEY).copy();

    //let oAABB = entity.getBoundingBox().inflate(8);
    /**
     * @type {$CompoundTag_}
     */
    let foundTag = null;
    let foundKey = -1;

    for (const key in frozenDataList) {
        let tag = frozenDataList[key];
        // console.log(tag);
        if (
            tag.getString("variant") !=
            (entity instanceof $EntityDragonBase
                ? entity.getVariant()
                : entity.getEggType().name())
        )
            continue;
        if (tag.getString("dimension") != dimension.toString()) continue;
        // oAABB.contains(tag.getInt("x")
        if (tag.getInt("x") != blockX) continue;
        if (tag.getInt("z") != blockZ) continue;
        if (!tag.getInt("y") || JavaMath.abs(tag.getInt("y") - blockY) > 2)
            continue;
        foundKey = key;
        foundTag = tag;
        break;
    }
    if (foundKey != -1) {
        frozenDataList.remove(parseInt(foundKey));
        // provider.persistentData.frozenDragonEggs.remove(foundKey);
        // provider.persistentData.remove(FROZEN_EGG_DATA_KEY);
        provider.persistentData.put(FROZEN_EGG_DATA_KEY, frozenDataList);
    }
    return foundTag;
}

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
        placedEggMap.forEach((key, value) => {
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

        placedEggMap.remove(eggUUID);
    });

    // console.log(found.variant);
    // console.log();
    // console.log(entity.block.pos);
    // console.log(found.block.pos == entity.block.pos);
    // console.log();
});

// let $BlockEntityEggInIce = Java.loadClass(
//     "com.iafenvoy.iceandfire.entity.block.BlockEntityEggInIce"
// );

// function get_pivate_field(cls, field) {
//     let cls_field = cls.class.getDeclaredField(field);
//     cls_field.setAccessible(true);
//     return cls_field.get(cls);
// }
// function set_pivate_field(cls, field, value) {
//     let cls_field = cls.class.getDeclaredField(field);
//     cls_field.setAccessible(true);
//     cls_field.set(cls, value);
// }

// BlockEvents.blockEntityTick("iceandfire:egginice", (event) => {
//     console.log(event.block.pos);
//     event.server.tell(event.block.pos);
// });

// BlockEvents.randomTick("iceandfire:egginice", (event) => {
//     console.log(event.block.pos);
//     event.server.tell(event.block.pos);
// });

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
