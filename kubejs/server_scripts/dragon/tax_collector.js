let $CompoundTag = Java.loadClass("net.minecraft.nbt.CompoundTag");
/**
 * 
 * @param {$Player_} player 
 * @returns {$Map_<string, number>}
 */
function rollRewardItems(/**@type {$Player_}*/player) {

    const { dragonConquerRecords } = player.persistentData

    const { STRUCTURE_DATA } = global
    
    
    if (!dragonConquerRecords) {
        return;
    }

    const result = Utils.newMap()

    dragonConquerRecords.getAllKeys().forEach((structure_type) => {
        let count = dragonConquerRecords[structure_type].size() * STRUCTURE_DATA[structure_type].product.count
        
        for (let _ = 0; _ < count; _++ ){
            let item = STRUCTURE_DATA[structure_type].product.item.getItem()
            if (!result.containsKey(item)) {
                result[item] = 1;
            } else {
                result[item]++;
            }
        }
        
    })

    return result;
}

/**
 * @param {$Map_<string, number>} items
 * @returns {$MutableComponent_}
 */
function weaveMessage_Items(items) {
    let text = Text.empty()
    items.forEach((item, count) => {
        if (!text.isEmpty()) {
            text.append(Text.gray(", "))
        }
        let translationKey = Item.of(item).item.descriptionId;
        text.append(Text.translate(translationKey).color(textColor)).append(Text.of(`x${count}`).gold())
    })
    return text
}

/**
 * @param {$CompoundTag_} dragonConquerRecords
 * @returns {$MutableComponent_}
 */
function weaveMessage_Records(dragonConquerRecords) {
    const {STRUCTURE_DATA} = global
    let text = Text.empty()
    if (!dragonConquerRecords) return;
    dragonConquerRecords.getAllKeys().forEach((structure_type) => {
        if (!text.isEmpty()) {
            text.append(Text.gray(", "))
        }
        let translationKey = STRUCTURE_DATA[structure_type].name

        dragonConquerRecords[structure_type].forEach((record) => {
            console.log(record)
            console.log(translationKey)
            text.append(Text.translate(translationKey).color(textColor)).append(Text.of(` (x:${record.getInt("minX")} y:${record.getInt("minY")} z:${record.getInt("minZ")})`).gold())
        })
    })

    return text;
}

/**
 * @param {$Map_<string, number>} items
 * @param {$Player_} player
 * @returns
 */
function sendItemsToPlayer(items, player) {
    items.forEach((item, count) => {
        let itemStack = Item.of(item)
        itemStack.setCount(count)
        player.give(itemStack)
    })
}

/**
 * 
 * @param {$SimplePlayerKubeEvent_} event 
 * @returns 
 */
function playerTick_TaxCollect(event) {
    const { player } = event;

    const { lastDay } = player.persistentData;

    if (!lastDay) {
        player.persistentData.putInt("lastDay", -1)
    }

    let currentDay = Math.floor(player.stats.playTime / 24000)
    if (currentDay == lastDay) return;
    player.persistentData.putInt("lastDay", currentDay)

    let items = rollRewardItems(player);
    
    let rewardText = weaveMessage_Items(items)

    if (rewardText.getString().length > 100) {
        player.tell(Text.translate("kubejs.taxcollector.daypass.much").color(textColor))
    } else {
        player.tell(Text.translate("kubejs.taxcollector.daypass").color(textColor))
        player.tell(rewardText)
    }
    

    sendItemsToPlayer(items, player)
    //collectTax(event);
}

/**
 * 
 * @param {$BlockPlacedKubeEvent_} event 
 * @returns 
 */
function blockPlaced_TaxCollect(event) {
    const { block, player } = event;
    if (!player) return;
    if (block.id != "kubejs:tax_collector") return;

    let data = new $CompoundTag();
    data.putString("dimension", event.getLevel().getDimension().toString())
    data.putInt("x", block.getX())
    data.putInt("y", block.getY())
    data.putInt("z", block.getZ())

    player.persistentData.put("activeTaxCollector", data)

    //player.tell(Text.translate("kubejs.taxcollector.placed").color(textColor))

    let recordText = weaveMessage_Records(player.persistentData.dragonConquerRecords)
    player.tell(recordText)

    if (recordText.getString().length > 100) {
        player.tell(Text.translate("kubejs.taxcollector.bind.much").color(textColor))
    } else {
        player.tell(Text.translate("kubejs.taxcollector.bind").color(textColor))
        player.tell(recordText)
    }

    //activeTaxCollector = data;

    // if (!taxCollectorData) {
    //     player.persistentData.taxCollectorData = new $CompoundTag()
    // }

    // let data = new $CompoundTag()
    // data.putUUID("owner", player)
    

    // block.setEntityData(data)
}

/**
 * 
 * @param {$BlockBrokenKubeEvent_} event 
 * @returns 
 */
function blockBroken_TaxCollect(event) {
    const { block, server } = event;
    if (block.id != "kubejs:tax_collector") return;

    let blockOwner = server.getPlayer(block.getEntityData().getString("ownerID"))

    if (!blockOwner) return;
    const { activeTaxCollector } = blockOwner.persistentData;
    if (!activeTaxCollector) return;
    if (activeTaxCollector.getString("dimension") != block.getDimension().toString()) return;
    //console.log(block.getDimension().toString())
    if (activeTaxCollector.getInt("x") != block.getX()) return;
    //console.log(block.getX())
    if (activeTaxCollector.getInt("y") != block.getY()) return;
    //console.log(block.getY())
    if (activeTaxCollector.getInt("z") != block.getZ()) return;
    //console.log(block.getZ())

    blockOwner.tell(Text.translate("kubejs.taxcollector.broken").color(textColor))

    blockOwner.persistentData.remove("activeTaxCollector");
    
}