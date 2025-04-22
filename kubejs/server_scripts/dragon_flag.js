let $BoundingBox = Java.loadClass("net.minecraft.world.level.levelgen.structure.BoundingBox")
let $OrderedCompoundTag = Java.loadClass("dev.latvian.mods.kubejs.util.OrderedCompoundTag")
let $BlockContainerJS = Java.loadClass("dev.latvian.mods.kubejs.level.BlockContainerJS")
let $ChunkPos = Java.loadClass("net.minecraft.world.level.ChunkPos")
let $ListTag = Java.loadClass("net.minecraft.nbt.ListTag")

const structureData = new Map([
    ["skyvillages:skyvillage", {
        gateway: "kubejs:village/sky_village"
    }]
])
const placedAgainstMap = {}

BlockEvents.rightClicked(event => {
    placedAgainstMap[event.player.uuid] = {block: event.block, facing: event.facing}
})

function clearDragonConquerRecord(player) {
    player.persistentData.dragonConquerRecords = new $OrderedCompoundTag()
}

function clearDragonConquerCurrent(player) {
    player.persistentData.remove("dragonConquerCurrent")
    player.persistentData.remove("dragonConquerCurrentId")
}

function conquerStatus(minX, maxX, minY, maxY, minZ, maxZ) {
    let result = new $OrderedCompoundTag()
    
    result.putInt("minX", minX)
    result.putInt("maxX", maxX)
    result.putInt("minY", minY)
    result.putInt("maxY", maxY)
    result.putInt("minZ", minZ)
    result.putInt("maxZ", maxZ)

    return result;
}

function addDragonConquerRecord(player, minX, maxX, minY, maxY, minZ, maxZ, structure_id) {
    addDragonConquerRecord_withConquerStatus(player, conquerStatus(minX, maxX, minY, maxY, minZ, maxZ), structure_id)
}

function addDragonConquerRecord_withConquerStatus(player, conquerStatus, structure_id) {
    const { dragonConquerRecords } = player.persistentData;

    //let recordsOfSameTypeStructure = dragonConquerRecords.get(structure_id)
        
    if (dragonConquerRecords[structure_id] == undefined) {
            dragonConquerRecords[structure_id] = []
    }
    dragonConquerRecords[structure_id].push(conquerStatus)
}

function matchDragonConquerRecord(player, minX, maxX, minY, maxY, minZ, maxZ, structure_id) {
    const { dragonConquerRecords } = player.persistentData;
    let result = false;

    if (dragonConquerRecords == undefined) {
        clearDragonConquerRecord(player)
    } else {
        if (dragonConquerRecords[structure_id] == undefined) {
            dragonConquerRecords[structure_id] = []
        }
        dragonConquerRecords[structure_id].forEach(record => {
            console.log(minX == record.getInt("minX"))
            if (minX == record.getInt("minX")
                && maxX == record.getInt("maxX")
                && minY == record.getInt("minY")
                && maxY == record.getInt("maxY")
                && minZ == record.getInt("minZ")
                && maxZ == record.getInt("maxZ")) {
                console.log(1441)
                result = true;
            }
            
            return;
        });
        
    }

    return result
}

function finishDragonConquest(player) {
    const { dragonConquerCurrent } = player.persistentData;

    if (dragonConquerCurrent == undefined) return;
    if (player.persistentData.getString("dragonConquerCurrentId") == undefined) return;

    addDragonConquerRecord_withConquerStatus(player, dragonConquerCurrent, player.persistentData.getString("dragonConquerCurrentId"))
    player.tell(Text.translate("kubejs.conquest.success").color(0xd77a61))

    // const trophy = Item.of("kubejs:dragon_conquest_trophy")
    // trophy.setCustomData("structure_id", structure_id)
    // player.give(trophy)
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
 
BlockEvents.placed(event => {
    if (event.block.id == "kubejs:dragon_flag") {
        // 放置龙旗基座时的提示
        let level = event.getLevel()
        let player = event.player

        let currentStructure;
        let structure_id = "";
        level.structureManager().startsForStructure($ChunkPos(player.blockPosition()), ()=>true).stream().forEach(ss => {
            if (ss.getBoundingBox().isInside(player.blockPosition())) {
                structure_id = Registry.of("worldgen/structure").getKey(ss.getStructure()).location()
                currentStructure = ss;
                return;
            }
        })

        return;
    }

    if (!event.block.hasTag("minecraft:banners")) return;

    let player = event.player
    let { block } = placedAgainstMap[player.uuid]
    if (!(block instanceof $BlockContainerJS)) return;
    if (block.id != "kubejs:dragon_flag") return;

    // 龙旗激活
    let level = event.getLevel()

    let currentStructure;
    let structure_id = "";
    level.structureManager().startsForStructure($ChunkPos(player.blockPosition()), ()=>true).stream().forEach(ss => {
        if (ss.getBoundingBox().isInside(player.blockPosition())) {
            structure_id = Registry.of("worldgen/structure").getKey(ss.getStructure()).location()
            currentStructure = ss;
            return;
        }
    })

    let targetGateway = "";

    structureData.forEach((data, structure) => {
        if (structure_id == structure) {
            targetGateway = data.gateway;
            return;
        }
        
    })
    
    if (!targetGateway) {
        //找不到对应的传送门
        player.tell(Text.translate("kubejs.conquest.failed_to_init").color(0xd77a61))
        return;
    }

    //检测当前占领

    if (event.player.persistentData.dragonConquerCurrent != undefined) {
        player.tell(Text.translate("kubejs.conquest.has_current_conquest").color(0xd77a61))
        return;
    }
    
    //dragonConquerRecords = new $OrderedCompoundTag()
    
    let bbox = currentStructure.getBoundingBox();
    // 检测已占领
    if (matchDragonConquerRecord(player, bbox.minX(), bbox.maxX(), bbox.minY(), bbox.maxY(), bbox.minZ(), bbox.maxZ(), structure_id)) {
        //block.set("kubejs:dragon_flag_active")
        player.tell(Text.translate("kubejs.conquest.conquest_already_completed").color(0xd77a61))
        return;
    }

    event.player.persistentData.put("dragonConquerCurrent", conquerStatus(bbox.minX(), bbox.maxX(), bbox.minY(), bbox.maxY(), bbox.minZ(), bbox.maxZ()))
    event.player.persistentData.putString("dragonConquerCurrentId", structure_id)

    event.player.stages.add("dragon_conquest_challenger")

    // console.log(event.player.persistentData.dragonConquerCurrent)

    event.server.runCommand(`/open_gateway ${block.getX()} ${block.getY()} ${block.getZ()} ${targetGateway}`)
    
 })