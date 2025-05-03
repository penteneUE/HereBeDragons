let $ChunkPos = Java.loadClass("net.minecraft.world.level.ChunkPos");
let $ListTag = Java.loadClass("net.minecraft.nbt.ListTag");

function clearDragonConquerRecord(player) {
    player.persistentData.remove("dragonConquerRecords");
}

function clearDragonConquerStructure(player, structure_id) {
    if (!player.persistentData.dragonConquerRecords) return;
    player.persistentData.dragonConquerRecords.remove(structure_id);
}

function clearDragonConquerCurrent(player) {
    player.persistentData.remove("dragonConquerCurrent");
    player.persistentData.remove("dragonConquerCurrentId");
}

/**
 *
 * @param {$Player_} player
 */
function clearDragonConquerHere(player) {
    let { structure_id, structure } = whichStructureAmI(
        player.blockPosition(),
        player.level
    );
    if (!player.persistentData.dragonConquerRecords) return;
    if (!player.persistentData.dragonConquerRecords[structure_id]) return;

    let index = 0;
    let found = false;
    /**@type {$ListTag_} */
    let list = player.persistentData.dragonConquerRecords[structure_id];
    let bbox = structure.getBoundingBox();

    let length = list.size();
    while (index < length) {
        let record = list[index];
        if (
            bbox.minX() == record.getInt("minX") &&
            bbox.maxX() == record.getInt("maxX") &&
            bbox.minY() == record.getInt("minY") &&
            bbox.maxY() == record.getInt("maxY") &&
            bbox.minZ() == record.getInt("minZ") &&
            bbox.maxZ() == record.getInt("maxZ")
        ) {
            found = true;
            break;
        }
        index++;
    }

    if (!found) return;

    player.persistentData.dragonConquerRecords[structure_id].remove(index);
}

function conquerStatus(minX, maxX, minY, maxY, minZ, maxZ) {
    let result = new $CompoundTag();

    result.putInt("minX", minX);
    result.putInt("maxX", maxX);
    result.putInt("minY", minY);
    result.putInt("maxY", maxY);
    result.putInt("minZ", minZ);
    result.putInt("maxZ", maxZ);

    return result;
}

function addDragonConquerRecord(
    player,
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
    structure_id
) {
    addDragonConquerRecord_withConquerStatus(
        player,
        conquerStatus(minX, maxX, minY, maxY, minZ, maxZ),
        structure_id
    );
}

function addDragonConquerRecord_withConquerStatus(
    player,
    conquerStatus,
    structure_id
) {
    let { dragonConquerRecords } = player.persistentData;

    //console.log(dragonConquerRecords);

    //let recordsOfSameTypeStructure = dragonConquerRecords.get(structure_id)

    if (!dragonConquerRecords || dragonConquerRecords.isEmpty()) {
        player.persistentData.dragonConquerRecords = new $CompoundTag();
        player.persistentData.dragonConquerRecords[structure_id] = [];
        console.log(111);
    }

    console.log(player.persistentData.dragonConquerRecords[structure_id]);

    if (!player.persistentData.dragonConquerRecords[structure_id]) {
        player.persistentData.dragonConquerRecords[structure_id] = [];
        console.log(player.persistentData.dragonConquerRecords[structure_id]);
    }
    console.log(111);
    player.persistentData.dragonConquerRecords[structure_id].push(
        conquerStatus
    );
    console.log(111);
}

function matchDragonConquerRecord_withBbox(player, bbox, structure_id) {
    return matchDragonConquerRecord(
        player,
        bbox.minX(),
        bbox.maxX(),
        bbox.minY(),
        bbox.maxY(),
        bbox.minZ(),
        bbox.maxZ(),
        structure_id
    );
}

function matchDragonConquerRecord(
    player,
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
    structure_id
) {
    let { dragonConquerRecords } = player.persistentData;
    let result = false;

    if (!structure_id) return;

    if (dragonConquerRecords == undefined) {
        return;
        //clearDragonConquerRecord(player)
    } else {
        if (dragonConquerRecords[structure_id] == undefined) {
            //dragonConquerRecords[structure_id] = []
            return;
        }
        dragonConquerRecords[structure_id].forEach((record) => {
            if (
                minX == record.getInt("minX") &&
                maxX == record.getInt("maxX") &&
                minY == record.getInt("minY") &&
                maxY == record.getInt("maxY") &&
                minZ == record.getInt("minZ") &&
                maxZ == record.getInt("maxZ")
            ) {
                result = true;
            }

            if (result) return;
        });
    }

    return result;
}

/**
 *
 * @param {$ServerPlayer_} player
 * @returns
 */
function finishDragonConquest(player) {
    let { dragonConquerCurrent } = player.persistentData;
    const { STRUCTURE_DATA } = global;
    //console.log(111);

    if (dragonConquerCurrent == undefined) return;
    //console.log(111);

    let currentId = player.persistentData.getString("dragonConquerCurrentId");
    if (currentId == undefined) return;
    //console.log(111);

    // console.log(STRUCTURE_DATA[currentId].gateway);

    // player.give(
    //     `kubejs:dragon_conquest_trophy[custom_data={gateway=${STRUCTURE_DATA[currentId].gateway}}]`
    // );

    // player.addItem(
    //     `kubejs:dragon_conquest_trophy[custom_data={gateway=${STRUCTURE_DATA[currentId].gateway}}]`
    // );

    addDragonConquerRecord_withConquerStatus(
        player,
        dragonConquerCurrent,
        currentId
    );
    clearDragonConquerCurrent(player);

    player.tell(Text.translate("kubejs.conquest.success").color(textColor));

    if (player.hasEffect("dragonsurvival:hunter_omen")) {
        player.removeEffect("dragonsurvival:hunter_omen");
    }
    // const trophy = Item.of("kubejs:dragon_conquest_trophy")
    // trophy.setCustomData("structure_id", structure_id)
    player.give(
        Item.of(
            `kubejs:dragon_conquest_trophy[custom_data={gateway:"${STRUCTURE_DATA[
                currentId
            ].gateway.replace("kubejs:", "")}"}]`
        )
    );
}

// function givesTrophyIfFirstTime(server, player, structure_id) {
//     const { dragonConquerRecords } = player.persistentData;
//     if (!(dragonConquerRecords instanceof $OrderedCompoundTag)) return;
//     // let tag = dragonConquerRecords.get(structure_id)
//     // if (tag instanceof $ListTag) {
//     //     tag.isEmpty()
//     // }
//     //console.log(dragonConquerRecords[structure_id])
//     if (!dragonConquerRecords[structure_id].isEmpty()) return;

//     //server.runCommand(`/give ${player.name.toString()} kubejs:dragon_conquest_trophy[minecraft:custom_data={structure_id:${structure_id}}]`)

// }

// /**
//  *
//  * @param {Internal.Entity} entity
//  * @param {String} structure
//  * @returns
//  */
// function isInStructure(entity, structure) {
//     let pos = entity.block.pos
//     let dimension = entity.getLevel().dimensionKey;
//     let sw = entity.server["getLevel(net.minecraft.resources.ResourceKey)"](dimension)
//     if (sw instanceof ServerLevel) {
//         let chunk = sw.getChunk(pos.x >> 4, pos.z >> 4, ChunkStatus.STRUCTURE_REFERENCES, false);
//         if (chunk == null) {
//             return false;
//         }
//         let references = chunk.getAllReferences();
//         for (references of references.entrySet()) {
//             let e = references
//             let longs = e.getValue();
//             if (!longs.isEmpty()) {
//                 let struct = e.getKey();
//                 let key = sw.registryAccess().registryOrThrow(Registries.STRUCTURE).getKey(struct);

//                 if (key.toString() == structure) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             }
//         }
//     }
//     return false;

// }

/**
 *
 * @param {$BlockPos_} blockPosition
 * @param {$ServerLevel_} level
 * @returns {{structure: $StructureStart_, structure_id: string}}
 */
function whichStructureAmI(blockPosition, level) {
    let structure;
    let structure_id = "";
    level
        .structureManager()
        .startsForStructure($ChunkPos(blockPosition), () => true)
        .stream()
        .forEach((ss) => {
            if (ss.getBoundingBox().isInside(blockPosition)) {
                structure_id = Registry.of("worldgen/structure")
                    .getKey(ss.getStructure())
                    .location();
                structure = ss;

                return;
            }
        });
    // if (structure_id == "minecraft:mansion") {
    //     console.log(blockPosition);
    // }
    return { structure: structure, structure_id: structure_id };
}

global.UTILS.whichStructureAmI = whichStructureAmI;

/**
 *
 * @param {$BlockPlacedKubeEvent_} event
 * @returns
 */
function blockPlaced_dragonConquer(event) {
    let { player } = event;

    if (!player) return;

    const { STRUCTURE_DATA } = global;

    if (event.block.id == "kubejs:dragon_flag") {
        // 放置龙旗基座时的提示
        //let level = event.getLevel()

        let { structure, structure_id } = whichStructureAmI(
            player.blockPosition(),
            event.getLevel()
        );

        if (structure_id == "") {
            //没有结构
            player.tell(
                Text.translate("kubejs.conquest.no_structure").color(textColor)
            );
            return;
        }

        let targetGateway = STRUCTURE_DATA[structure_id];

        if (!targetGateway) {
            player.tell(
                Text.translate("kubejs.conquest.structure_not_available").color(
                    textColor
                )
            );
            return;
        }

        //检测当前占领

        if (event.player.persistentData.dragonConquerCurrent != undefined) {
            player.tell(
                Text.translate("kubejs.conquest.has_current_conquest").color(
                    textColor
                )
            );
            return;
        }

        //dragonConquerRecords = new $OrderedCompoundTag()

        let bbox = structure.getBoundingBox();
        // 检测已占领
        if (
            matchDragonConquerRecord(
                player,
                bbox.minX(),
                bbox.maxX(),
                bbox.minY(),
                bbox.maxY(),
                bbox.minZ(),
                bbox.maxZ(),
                structure_id
            )
        ) {
            //block.set("kubejs:dragon_flag_active")
            player.tell(
                Text.translate(
                    "kubejs.conquest.conquest_already_completed"
                ).color(textColor)
            );
            return;
        }

        player.tell(
            Text.translatable("kubejs.conquest.info.structure", [
                Text.translate(STRUCTURE_DATA[structure_id].name).gold(),
            ]).color(textColor)
        );
        player.tell(
            Text.translate(STRUCTURE_DATA[structure_id].description).color(
                textColor
            )
        );
        player.tell(
            Text.translate("kubejs.conquest.info.ask").color(textColor)
        );

        return;
    }

    if (!event.block.hasTag("minecraft:banners")) return;

    let { block } = placedAgainstMap[player.uuid];
    //if (!(block instanceof $BlockContainerJS)) return;
    if (block.id != "kubejs:dragon_flag") return;

    // 龙旗激活
    //let level = event.getLevel()

    // let currentStructure;
    // let structure_id = "";
    // level.structureManager().startsForStructure($ChunkPos(player.blockPosition()), ()=>true).stream().forEach(ss => {
    //     if (ss.getBoundingBox().isInside(player.blockPosition())) {
    //         structure_id = Registry.of("worldgen/structure").getKey(ss.getStructure()).location()
    //         currentStructure = ss;
    //         return;
    //     }
    // })
    let { structure, structure_id } = whichStructureAmI(
        player.blockPosition(),
        event.getLevel()
    );

    if (structure_id == "") {
        //没有结构
        player.tell(
            Text.translate("kubejs.conquest.no_structure").color(textColor)
        );
        return;
    }

    let targetGateway = STRUCTURE_DATA[structure_id].gateway;

    if (!targetGateway) {
        player.tell(
            Text.translate("kubejs.conquest.structure_not_available").color(
                textColor
            )
        );
        return;
    }

    // STRUCTURE_DATA.forEach((data, structure) => {
    //     if (structure_id == structure) {
    //         targetGateway = data.gateway;
    //         return;
    //     }

    // })

    //检测当前占领

    if (event.player.persistentData.dragonConquerCurrent != undefined) {
        player.tell(
            Text.translate("kubejs.conquest.has_current_conquest").color(
                textColor
            )
        );
        return;
    }

    //dragonConquerRecords = new $OrderedCompoundTag()

    let bbox = structure.getBoundingBox();
    // 检测已占领
    if (
        matchDragonConquerRecord(
            player,
            bbox.minX(),
            bbox.maxX(),
            bbox.minY(),
            bbox.maxY(),
            bbox.minZ(),
            bbox.maxZ(),
            structure_id
        )
    ) {
        //block.set("kubejs:dragon_flag_active")
        player.tell(
            Text.translate("kubejs.conquest.conquest_already_completed").color(
                textColor
            )
        );
        return;
    }

    event.player.persistentData.put(
        "dragonConquerCurrent",
        conquerStatus(
            bbox.minX(),
            bbox.maxX(),
            bbox.minY(),
            bbox.maxY(),
            bbox.minZ(),
            bbox.maxZ()
        )
    );
    event.player.persistentData.putString(
        "dragonConquerCurrentId",
        structure_id
    );

    //event.player.stages.add("dragon_conquest_challenger");

    // console.log(event.player.persistentData.dragonConquerCurrent)

    event.server.runCommandSilent(
        `/open_gateway ${block.getX()} ${block.getY()} ${block.getZ()} ${targetGateway}`
    );
}
