/**
 *
 * @param {"iceandfire:fire_dragon" | "iceandfire:ice_dragon" | "iceandfire:lightning_dragon"} type
 * @param {$CompoundTag_} breedData
 * @returns {$ItemStack_}
 */
function createGeneHolder(type, breedData) {
    let holderDataTag = new $CompoundTag();
    holderDataTag.put(BREED_DATA_KEY, breedData);

    let newItem = Item.of("kubejs:gene_holder");

    switch (type) {
        case "iceandfire:fire_dragon":
            newItem.setCustomModelData(666);
            //holderDataTag.putString("holding", "FIRE");
            holderDataTag.putString("holding", type);
            break;
        case "iceandfire:ice_dragon":
            newItem.setCustomModelData(777);
            holderDataTag.putString("holding", type);
            break;
        case "iceandfire:lightning_dragon":
            newItem.setCustomModelData(888);
            holderDataTag.putString("holding", type);
            break;
        default:
            return;
    }

    newItem.setCustomData(holderDataTag);
    return newItem;
}

ItemEvents.entityInteracted((event) => {
    const { player, hand, target } = event;
    if (
        !(
            hand == "main_hand" &&
            player.getMainHandItem().id === "kubejs:gene_holder"
        )
    )
        return;
    if (!isIAFDragon(target)) return;
    if (player.mainHandItem.getCustomData().getString("holding")) return;
    //if (!(target instanceof $Mob)) return;

    let inLove = target.nbt.getInt("InLove");
    if (inLove == 0) {
        player.statusMessage = Text.red({
            translate: "kubejs.status.gene_holder.not_in_love",
        });

        event.server.runCommandSilent(
            `/playsound minecraft:block.note_block.snare player ${player.username.toString()} ${
                player.x
            } ${player.y} ${player.z} 10 0.5`
        );
        return;
    }
    //player.tell(target.displayName);

    let breedData = getBreedDataFromEntity(target);
    if (!breedData) return;

    let newItem = createGeneHolder(target.type, breedData);

    if (target.hasCustomName()) {
        newItem.setCustomName(
            Text.translate("item.kubejs.gene_holder.named", [
                Text.of(target.customName).italic(),
            ])
        );
    }

    player.mainHandItem.shrink(1);
    player.giveInHand(newItem);

    player.swing("main_hand");

    let updateDragonTag = new $CompoundTag();
    updateDragonTag.putInt("InLove", 0);
    target.mergeNbt(updateDragonTag);

    target.level.spawnParticles(
        "minecraft:campfire_cosy_smoke",
        true,
        target.x + 0.5,
        target.y + 1.05,
        target.z + 0.5,
        0,
        0.3,
        0,
        2,
        0.1
    );
    // /damage 54a49189-e34d-4496-984b-4ba4b2322d21 1 minecraft:sting by Jester_Romut

    event.server.runCommandSilent(
        `/damage ${target
            .getUuid()
            .toString()} 1 minecraft:sting by ${player.username.toString()} from ${player.username.toString()}`
    );

    event.server.runCommandSilent(
        `/playsound minecraft:item.honey_bottle.drink player ${player.username.toString()} ${
            player.x
        } ${player.y} ${player.z}`
    );
});
