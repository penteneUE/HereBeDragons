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
function weaveMessage(items) {
    let text = Text.empty()
    items.forEach((item, count) => {
        if (!text.isEmpty()) {
            text.append(Text.gray(", "))
        }
        let translationKey = Item.of(item).item.descriptionId;
        text.append(Text.translate(translationKey).color(0xd77a61)).append(Text.of(`x${count}`).gold())
    })
    return text
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
    
    let rewardText = weaveMessage(items)

    if (rewardText.getString().length > 60) {
        player.tell(Text.translate("kubejs.taxcollector.daypass.much").color(0xd77a61))
    } else {
        player.tell(Text.translate("kubejs.taxcollector.daypass").color(0xd77a61))
    }

    player.tell(rewardText)

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
    blockOwner.tell(Text.translate("kubejs.taxcollector.broken").color(0xd77a61))

    blockOwner.persistentData.remove("activeTaxCollector");
    
}