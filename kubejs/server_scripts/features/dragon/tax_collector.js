let $BlockPos = Java.loadClass("net.minecraft.core.BlockPos");
let $CompoundTag = Java.loadClass("net.minecraft.nbt.CompoundTag");

const tagCountAsBlock = [
    "c:storage_blocks",
    "minecraft:mineable/pickaxe",
    "minecraft:mineable/axe",
    "minecraft:mineable/shovel",
];

/**
 *
 * @param {$Player_} player
 * @param {$ItemStack} preferredItem
 * @returns {$Map_<string, number>}
 */
function rollRewardItems(/**@type {$Player_}*/ player, preferredItem) {
    let { dragonConquerRecords } = player.persistentData;

    let { STRUCTURE_DATA } = global;

    if (!dragonConquerRecords) {
        return;
    }

    let result = Utils.newMap();

    let rewardsContainsPreferredItem = false;
    let preferredItemId = "";
    if (preferredItem) {
        preferredItemId = preferredItem.toStringJS().replace("'", "");
        //preferredItemId = preferredItem.item.toString()
    }

    let totalItemCount = 0;
    let wRandomList = weightedRandom();

    dragonConquerRecords.getAllKeys().forEach((structure_type) => {
        let count =
            dragonConquerRecords[structure_type].size() *
            STRUCTURE_DATA[structure_type].product.count;

        for (let _ = 0; _ < count; _++) {
            if (preferredItemId && !rewardsContainsPreferredItem) {
                if (
                    Array.from(
                        STRUCTURE_DATA[structure_type].product.item.items.keys()
                    ).findIndex((itemId) => itemId == preferredItemId) != -1
                ) {
                    rewardsContainsPreferredItem = true;
                }
                //let testMap = new Map([["uhrwerk", 1], ["macbeth", 2], ["nerv", 3]])
                //console.log(Array.from(testMap.keys()).join(","))
                //console.log([...testMap.keys()])
            }
            let item = STRUCTURE_DATA[structure_type].product.item.getItem();

            if (!result.containsKey(item)) {
                result[item] = 1;
                wRandomList.add(item, 1);
            } else {
                result[item]++;
                wRandomList.items[item]++;
            }

            totalItemCount++;
        }
    });

    //console.log(rewardsContainsPreferredItem)
    if (rewardsContainsPreferredItem) {
        let replaceCount = Math.ceil(Math.random() * (totalItemCount / 6));

        // let weightedRandom = global.UTILS.weightedRandom()

        // result.keySet().toArray().forEach((value, index) => {
        //     weightedRandom.add()
        // })
        for (let _ = 0; _ < replaceCount; _++) {
            let itemToRemove = wRandomList.getItem();
            if (result[itemToRemove] <= 1) {
                result.remove(itemToRemove);
            } else {
                result[itemToRemove]--;
            }
        }

        if (!result.containsKey(preferredItemId)) {
            result[preferredItemId] = replaceCount;
        } else {
            result[preferredItemId] += replaceCount;
        }
    }

    //console.log(result)

    return result;
}

/**
 * @param {$Map_<string, number>} items
 * @returns {$MutableComponent_}
 */
function weaveMessage_Items(items) {
    let text = Text.empty();
    items.forEach((item, count) => {
        if (!text.isEmpty()) {
            text.append(Text.gray(", "));
        }
        let translationKey = Item.of(item).item.descriptionId;
        text.append(Text.translate(translationKey).color(textColor)).append(
            Text.of(`x${count}`).gold()
        );
    });
    return text;
}

/**
 * @param {$CompoundTag_} dragonConquerRecords
 * @returns {$MutableComponent_}
 */
function weaveMessage_Records(dragonConquerRecords) {
    const { STRUCTURE_DATA } = global;
    let text = Text.empty();
    if (!dragonConquerRecords) return;
    dragonConquerRecords.getAllKeys().forEach((structure_type) => {
        if (!text.isEmpty()) {
            text.append(Text.gray(", "));
        }
        let translationKey = STRUCTURE_DATA[structure_type].name;

        dragonConquerRecords[structure_type].forEach((record) => {
            //console.log(record)
            //console.log(translationKey)
            text.append(Text.translate(translationKey).color(textColor)).append(
                Text.of(
                    ` (x:${record.getInt("minX")} y:${record.getInt(
                        "minY"
                    )} z:${record.getInt("minZ")})`
                ).gold()
            );
        });
    });

    return text;
}

/**
 * @param {$Map_<string, number>} items
 * @param {$Player_} player
 * @returns
 */
function sendItemsToPlayer(items, player) {
    items.forEach((item, count) => {
        // let itemStack = Item.of(item);
        // itemStack.setCount(count);
        // player.give(itemStack);
        player.give(`${Utils.parseInt(count, 1)}x ${item}`);
    });
}

/**
 * @param {$Map_<string, number>} items
 * @param {$BlockContainerJS_} block
 * @returns
 */
function sendItemsToBlockInventory(items, block) {
    let { inventory } = block;
    items.forEach((item, count) => {
        let itemStack = Item.of(item);
        itemStack.setCount(count);

        // let existingItem = inventory.find(item)

        // if (existingItem != -1) {
        //     itemStack = inventory.insertItem(existingItem, itemStack, false)
        // } else {
        //     itemStack = inventory.insertItem(itemStack, false)
        // }

        // if (inventory.countNonEmpty() >= inventory.slots) {
        //     block.popItemFromFace(itemStack, Direction.UP)
        //     return;
        // }

        for (var i = 0; i < inventory.getSlots(); i++) {
            if (itemStack.isEmpty()) break;

            itemStack = inventory.insertItem(i, itemStack, false);
            // let thingInSlot = inventory.getStackInSlot(i)
            // if (!thingInSlot.isEmpty() && itemStack.asIngredient().test(thingInSlot)) {
            //     itemStack = inventory.insertItem(i, itemStack, false)
            //     console.log(111)
            // }
            //inventory.setStackInSlot(i, itemStack)
        }

        if (!itemStack.isEmpty())
            block.popItemFromFace(itemStack, Direction.UP);
    });
}

/**
 *
 * @param {$SimplePlayerKubeEvent_} event
 * @returns
 */
function playerTick_TaxCollect(event) {
    let { player } = event;

    let { lastDay } = player.persistentData;

    if (!lastDay) {
        player.persistentData.putInt("lastDay", -1);
    }

    let currentDay = Math.floor(player.stats.playTime / 24000);
    if (currentDay == lastDay) return;
    player.persistentData.putInt("lastDay", currentDay);

    let { activeTaxCollector } = player.persistentData;

    if (!activeTaxCollector) return;

    let taxCollectorBlock = event.server
        .getLevel(activeTaxCollector.getString("dimension"))
        .getBlock(
            activeTaxCollector.getInt("x"),
            activeTaxCollector.getInt("y"),
            activeTaxCollector.getInt("z")
        );
    if (taxCollectorBlock.id != "kubejs:tax_collector") return;

    if (
        taxCollectorBlock.getEntityData().getString("ownerID") !=
        player.getUuid().toString()
    )
        return;

    if (!player.persistentData.dragonConquerRecords) return;
    if (player.persistentData.dragonConquerRecords.isEmpty()) return;
    let muted = false;
    let items = Utils.emptyMap();

    if (!taxCollectorBlock.getInventory().isEmpty()) {
        let preferredItem = taxCollectorBlock.getInventory().allItems.first;
        //圆榫不入方卯

        let isBlock = false;

        //console.log(preferredItem.tags)
        tagCountAsBlock.forEach((tag) => {
            if (isBlock) return;
            if (preferredItem.hasTag(tag)) {
                isBlock = true;
            }
        });

        if (isBlock) {
            muted = true;
            items = rollRewardItems(player);
        } else {
            items = rollRewardItems(player, preferredItem);

            //console.log(preferredItem.toStringJS())
            //true console.log(preferredItem.toStringJS().replace("'", '') == 'minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:mending":1}}]')
        }
    } else {
        items = rollRewardItems(player);
    }

    let rewardText = weaveMessage_Items(items);

    //送货上门
    let blockBelow = taxCollectorBlock.down;

    if (blockBelow.getInventory()) {
        sendItemsToBlockInventory(items, blockBelow);
    } else {
        console.log(items);
        sendItemsToPlayer(items, player);
    }

    if (muted) return;
    // 发送消息

    if (rewardText.getString().length > 100) {
        player.tell(
            Text.translate("kubejs.taxcollector.daypass.much").color(textColor)
        );
    } else {
        player.tell(
            Text.translate("kubejs.taxcollector.daypass").color(textColor)
        );
        player.tell(rewardText);
    }

    if (blockBelow.getInventory()) {
        player.tell(
            Text.translate("kubejs.taxcollector.daypass.withstorage").color(
                textColor
            )
        );
    }

    //collectTax(event);
}

/**
 *
 * @param {$BlockPlacedKubeEvent_} event
 * @returns
 */
function blockPlaced_TaxCollect(event) {
    let { block, player } = event;
    if (!player) return;
    if (block.id != "kubejs:tax_collector") return;

    let data = new $CompoundTag();
    data.putString("dimension", event.getLevel().getDimension().toString());
    data.putInt("x", block.getX());
    data.putInt("y", block.getY());
    data.putInt("z", block.getZ());

    player.persistentData.put("activeTaxCollector", data);

    //player.tell(Text.translate("kubejs.taxcollector.placed").color(textColor))
    if (!player.persistentData.dragonConquerRecords) {
        player.tell(
            Text.translate("kubejs.taxcollector.bind.nothing").color(textColor)
        );
        return;
    }

    let recordText = weaveMessage_Records(
        player.persistentData.dragonConquerRecords
    );
    //player.tell(recordText)

    if (recordText.getString().length > 100) {
        player.tell(
            Text.translate("kubejs.taxcollector.bind.much").color(textColor)
        );
    } else {
        player.tell(
            Text.translate("kubejs.taxcollector.bind").color(textColor)
        );
        player.tell(recordText);
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
    let { block, server } = event;
    if (block.id != "kubejs:tax_collector") return;

    let blockOwner = server.getPlayer(
        block.getEntityData().getString("ownerID")
    );

    if (!blockOwner) return;
    let { activeTaxCollector } = blockOwner.persistentData;
    if (!activeTaxCollector) return;
    if (
        activeTaxCollector.getString("dimension") !=
        block.getDimension().toString()
    )
        return;
    //console.log(block.getDimension().toString())
    if (activeTaxCollector.getInt("x") != block.getX()) return;
    //console.log(block.getX())
    if (activeTaxCollector.getInt("y") != block.getY()) return;
    //console.log(block.getY())
    if (activeTaxCollector.getInt("z") != block.getZ()) return;
    //console.log(block.getZ())

    blockOwner.tell(
        Text.translate("kubejs.taxcollector.broken").color(textColor)
    );

    blockOwner.persistentData.remove("activeTaxCollector");

    // block.getInventory().allItems.forEach((item) => {
    //     if (item) block.popItem(item);
    // });
}

PlayerEvents.tick((event) => {
    if (event.player.tickCount % 20 != 0) return;
    playerTick_TaxCollect(event);
});

BlockEvents.placed((event) => {
    blockPlaced_TaxCollect(event);
    // blockPlaced_endlessChallenge(event);
});

BlockEvents.broken((event) => {
    blockBroken_TaxCollect(event);
});

PlayerEvents.loggedIn((event) => {
    let player = event.player;

    const { activeTaxCollector } = player.persistentData;

    if (activeTaxCollector) {
        let taxCollector = event.server
            .getLevel(activeTaxCollector.getString("dimension"))
            .getBlock(
                activeTaxCollector.getInt("x"),
                activeTaxCollector.getInt("y"),
                activeTaxCollector.getInt("z")
            );
        if (taxCollector.id == "kubejs:tax_collector") return;
        if (!taxCollector.getEntityData()) return;
        if (
            taxCollector.getEntityData().getString("ownerID") ==
            player.getUuid().toString()
        )
            return;
        //console.log(player.getUuid().toString())

        player.persistentData.remove("activeTaxCollector");
        player.tell(
            Text.translate("kubejs.taxcollector.broken").color(0xd77a61)
        );
    }
});
