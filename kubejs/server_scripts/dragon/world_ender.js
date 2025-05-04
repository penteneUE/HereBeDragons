function clearWorldEnder(player) {
    player.stages
        .getAll()
        .removeIf((str) => str.startsWith("quest/world_ender_stage_"));
}

let scpHeads = global.UTILS.weightedRandom();
// 035
scpHeads.add(
    'profile={id:[I;2135143191,-622504004,-1550185850,-329157343],properties:[{name:"textures",value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmE0ZWNiMzRjMGUyY2ViYzg1YmRjYTkxN2YyZDU0NDk2M2Q2MjYwNzA3OTUwMTUyNjY2NWRiM2Q0ZjNjMTAzOSJ9fX0="}]}',
    1
);
// 173
scpHeads.add(
    'profile={id:[I;-862804044,-1645919550,-1189999875,-1976814097],properties:[{name:"textures",value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZjZjMzRjYjNmYzZkNzljMTc5N2Y5NDE0MTI1NDU3MGJkMDZjZTdkMTVkYjc4ODM0NjNmODYwYWY5YTNhYmYxZiJ9fX0="}]}',
    1
);
// 939
scpHeads.add(
    'profile={id:[I;-393351044,-1840691057,-2053004388,-56797157],properties:[{name:"textures",value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvODg0NjM0NjEyYzRhMTIwMDdjZjA2ZWNkYzQ0ZmY5ZDRmZDQzNjdiMGM0NzM5ODQ5NjU3ZmI0MDUyZWIyNTI3MSJ9fX0="}]}',
    1
);
// 106
scpHeads.add(
    'profile={id:[I;-434095353,517359398,-1344892643,-892638446],properties:[{name:"textures",value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzk4ZDQ2N2UzMDAyODc4NGRlMjQ5YzhiMjBiYjllZWM0ZmFhOGM1NTJjZGJkNzUxZjkwYTJmZmE5NTE3M2RkMyJ9fX0="}]}',
    1
);
// 079 赫赫，气死某人的电脑叠
scpHeads.add(
    'profile={id:[I;-1745659316,-220508699,-2038694604,1930672803],properties:[{name:"textures",value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmY0MmU5YmQ3ZmM1NTA5Mzc1OTM4YzZhY2IwMzU1ZTM0Y2JiZjVkMTViMWIzZTJlM2Q1NTU4NWE5NmNlZGY3NiJ9fX0="}]}',
    1
);

/**
 * WORLD ENDER STAGE 1
 * @param {$BlockRightClickedKubeEvent_} event
 */
function handleHarvestBee(event) {
    let { player } = event;

    if (!player) return;
    if (!player.stages.has("quest/world_ender_stage_0")) return;
    if (player.mainHandItem.id != "minecraft:glass_bottle") return;

    if (Math.floor(Math.random() * 2) == 0) return;

    let stack = Item.of(player.mainHandItem.id);
    stack.setCount(player.mainHandItem.count);
    stack.shrink(1);

    let potion = Item.of("minecraft:potion");

    potion.setPotionId("minecraft:strong_harming");

    player.mainHandItem = potion;
    player.give(stack);

    clearWorldEnder(player);
    //player.stages.remove("quest/world_ender_stage_0");
    player.stages.add("quest/world_ender_stage_1");

    event.server.runCommandSilent(
        `/playsound minecraft:ambient.cave player ${player.username.toString()} ${
            player.x
        } ${player.y} ${player.z}`
    );
}

/**
 *
 * @param {$BlockRightClickedKubeEvent_} event
 */
function handleWaterBlockEvent(event) {
    let { player, block } = event;

    if (!player) return;
    if (!player.stages.has("quest/world_ender_stage_2")) return;

    //if (Math.floor(Math.random() * 2) == 0) return;

    if (
        player.mainHandItem != "minecraft:water_bucket" &&
        player.offHandItem != "minecraft:water_bucket"
    )
        return;

    let waterBlock;
    switch (event.facing) {
        case Direction.UP:
            waterBlock = block.up;
            break;
        case Direction.DOWN:
            waterBlock = block.down;
            break;
        case Direction.EAST:
            waterBlock = block.east;
            break;
        case Direction.WEST:
            waterBlock = block.west;
            break;
        case Direction.NORTH:
            waterBlock = block.north;
            break;
        case Direction.SOUTH:
            waterBlock = block.south;
            break;
    }
    if (!waterBlock) return;

    waterBlock.set("minecraft:lava");

    event.server.scheduleInTicks(10, () => {
        //clearWorldEnder(player);
        player.stages.add("quest/world_ender_stage_3");
    });

    event.server.runCommandSilent(
        `/playsound minecraft:ambient.cave player ${player.username.toString()} ${
            player.x
        } ${player.y} ${player.z}`
    );
}

/**
 *
 * @param {$BlockRightClickedKubeEvent_} event
 */
function handleCampfireBlockEvent(event) {
    let { player, block } = event;

    if (!player) return;
    if (!player.stages.has("quest/world_ender_stage_4")) return;

    if (block.id != "minecraft:campfire") return;

    if (
        (!player.mainHandItem || player.mainHandItem.isEmpty()) &&
        (!player.offHandItem || player.offHandItem.isEmpty())
    )
        return;

    //console.log(block.getInventory());
    //console.log(`minecraft:player_head[${scpHeads.getItem()}]`);

    event.server.scheduleInTicks(200, () => {
        if (!block) return;

        // player.give(
        //     Item.of(
        //         `minecraft:player_head[profile={id:[I;2135143191,-622504004,-1550185850,-329157343],properties:[{name:"textures",value:"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMmE0ZWNiMzRjMGUyY2ViYzg1YmRjYTkxN2YyZDU0NDk2M2Q2MjYwNzA3OTUwMTUyNjY2NWRiM2Q0ZjNjMTAzOSJ9fX0="}]}]`
        //     )
        // );

        block.popItemFromFace(
            Item.of(`minecraft:player_head[${scpHeads.getItem()}]`),
            Direction.UP
        );
        block.setEntityData(new $CompoundTag());
        block.set("minecraft:soul_campfire");

        clearWorldEnder(player);
        player.stages.add("quest/world_ender_stage_completed");
        event.server.runCommandSilent(
            `/playsound minecraft:ambient.cave player ${player.username.toString()} ${
                player.x
            } ${player.y} ${player.z}`
        );
        // let maxSlots = block.getInventory().getSlots();
        // for (let i = 0; i < maxSlots; i++) {
        //     block
        //         .getInventory()
        //         .setStackInSlot(
        //             i,
        //             Item.playerHeadFromBase64(scpHeads.getItem())
        //         );
        // }
    });
}

BlockEvents.rightClicked("minecraft:beehive", handleHarvestBee);
BlockEvents.rightClicked("minecraft:bee_nest", handleHarvestBee);

BlockEvents.rightClicked(
    (event) => {
        handleWaterBlockEvent(event);
        handleCampfireBlockEvent(event);
        //event.facing.getOpposite()
    }
    //event.cancel()
);

ItemEvents.rightClicked("minecraft:water_bucket", (event) => {
    let { player } = event;
    if (!player) return;
    if (!player.stages.has("quest/world_ender_stage_2")) return;
    event.cancel();
});

PlayerEvents.inventoryClosed(
    "custommachinery:custom_machine_container",
    (event) => {
        let { player, level } = event;
        if (!player) return;
        if (!player.stages.has("quest/world_ender_stage_completed")) return;

        let taxCollectorItem = event.inventoryContainer.getItems().last;

        if (!taxCollectorItem) return;
        if (taxCollectorItem.id != "minecraft:dragon_egg") return;

        // if (player.stages.has("paper_myth_challenger")) {
        //     player.tell(
        //         Text.translate("kubejs.challenge.has_current_challenge").color(
        //             textColor
        //         )
        //     );
        //     return;
        // }

        /**@type {$BlockContainerJS_} */
        let block = placedAgainstMap[event.player.uuid].block;

        let { x, y, z } = block;
        player.give("minecraft:dragon_egg");
        let explosion = level.createExplosion(x, y, z);
        explosion.strength(3);
        explosion.explosionMode("mob");
        explosion.explode();

        block.spawnLightning();
        block.set("minecraft:air");

        level.spawnParticles(
            "minecraft:explosion",
            true,
            x,
            y,
            z,
            0,
            0.3,
            0,
            2,
            0.1
        );

        player.stages.add("paper_myth_challenger");
        player.persistentData.remove("activeTaxCollector");

        event.server.runCommandSilent(
            `/playsound minecraft:entity.wither.spawn player ${player.username.toString()} ${
                player.x
            } ${player.y} ${player.z}`
        );

        event.server.scheduleInTicks(20, () => {
            let result = summonGateway(
                player,
                block.getPos(),
                "kubejs:challenge/paper_myth",
                event.level
            );
            if (result == -1) {
                player.tell(
                    Text.translate("kubejs.conquest.error").color(textColor)
                );
                player.stages.remove("paper_myth_challenger");
                return;
            }
            // event.server.runCommandSilent(
            //     `/open_gateway ${player.username.toString()} kubejs:challenge/paper_myth`
            // );
        });

        //clearWorldEnder(player);
    }
);

// ItemEvents.entityInteracted((event) => {
//     let {
//         target,
//         player,
//         player: { mainHandItem },
//     } = event;
//     if (event.hand != "main_hand") return;
//     if (mainHandItem.id != "kubejs:paper_dragon_egg") return;
//     if (target.id != "gateways:endless_gateway") return;
//     console.log(111);
// });

// PlayerEvents.inventoryClosed("kubejs:menu", (event) => {
//     console.log(111);
// });

// PlayerEvents.chestClosed(
//     "custommachinery:custom_machine_container",
//     (event) => {
//         console.log(111);
//     }
// );

// ItemEvents.rightClicked((event) => {
//     let { player } = event;
//     if (!player) return;

//     //if (!player.stages.has("quest/world_ender_stage_2")) return;
//     //event.cancel();
// });

// ItemEvents.smelted((event) => {
//     console.log(event.item);
// });
