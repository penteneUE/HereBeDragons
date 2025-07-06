//priority: 3
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

// addDragonConquerRecord和conquerStatus也是内部使用的。毕竟dragonConquerRecord的唯一来源就是dragon_conquer.js。不希望有更多来源（可能造成混乱。kubeJS函数是没有引用提示的）。

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
