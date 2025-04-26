ISSEvents.spellOnCast((event) => {
    switch (event.spellId) {
        case "kubejs:taotie_fabel":
            if (event.entity.isPlayer()) {
                let player = event.entity;

                let growth = global.UTILS.dragonGrowth(player);

                let maxSpace =
                    growth == -1
                        ? 1
                        : (Math.pow(event.spellLevel, 1.5) * growth) / 10;
                //let maxSpace = Math.pow(event.spellLevel, 1.5);
                let infinite = event.spellLevel > 10;

                if (player.shiftKeyDown) {
                    if (!player.persistentData.consumedEntity) return;

                    let count = 0;
                    player.persistentData.consumedEntity.forEach((tag) => {
                        let newEntity = event.level.createEntity(
                            tag.getString("type")
                        );
                        newEntity.mergeNbt(tag.nbt);
                        newEntity.x = player.x;
                        newEntity.y = player.y;
                        newEntity.z = player.z;
                        //newEntity.setPosition(player.x, player.y, player.z);
                        newEntity.spawn();

                        event.level.spawnParticles(
                            "minecraft:campfire_cosy_smoke",
                            true,
                            newEntity.x + 0.5,
                            newEntity.y + 1.05,
                            newEntity.z + 0.5,
                            0,
                            0.3,
                            0,
                            2,
                            0.1
                        );
                        count++;
                    });
                    player.persistentData.remove("consumedEntity");
                    player.persistentData.remove("consumedSpace");

                    player.statusMessage = Text.translate(
                        "kubejs.spell.taotie_fabel.status.out",
                        [Utils.parseInt(count, 0)]
                    ).color(dragonMagicColor);

                    //event.server.runCommandSilent(`/title ${player} actionbar ${}`)
                    return;
                }

                //event.entity.tell("i love you");
                let k = event.spellLevel * 8;
                let oAABB = player.getBoundingBox().inflate(k);

                if (!player.persistentData.consumedEntity) {
                    player.persistentData.consumedEntity = new $ListTag();
                }
                if (!player.persistentData.consumedSpace) {
                    player.persistentData.putDouble("consumedSpace", 0);
                }

                let count = 0;
                let isMax = false;
                event.level.getEntitiesWithin(oAABB).forEach((entity) => {
                    if (isMax) return;
                    if (!entity.persistentData.OwnerName) return;

                    if (!infinite) {
                        if (
                            player.persistentData.getDouble("consumedSpace") >=
                            maxSpace
                        ) {
                            isMax = true;
                            return;
                        }
                        // console.log(`${entity.type}↓`);
                        // console.log(entity.boundingBox.getSize());
                    }
                    //entity.setPosition(player.x, player.y, player.z);
                    let tag = new $CompoundTag();
                    tag.type = entity.type;
                    tag.nbt = entity.nbt;

                    event.level.spawnParticles(
                        "minecraft:campfire_cosy_smoke",
                        true,
                        entity.x + 0.5,
                        entity.y + 1.05,
                        entity.z + 0.5,
                        0,
                        0.3,
                        0,
                        2,
                        0.1
                    );

                    player.persistentData.consumedEntity.addLast(tag);
                    player.persistentData.putDouble(
                        "consumedSpace",
                        player.persistentData.getDouble("consumedSpace") +
                            entity.boundingBox.getSize()
                    );
                    console.log(entity.boundingBox.getSize());

                    entity.discard();
                    count++;

                    //entity.teleportTo(player);
                });
                //player.persistentData.putDouble("consumedSpace", consumedSpace);

                player.statusMessage = Text.translate(
                    "kubejs.spell.taotie_fabel.status.in",
                    [Utils.parseInt(count, 0)]
                )
                    .append(
                        isMax
                            ? Text.translate(
                                  "kubejs.spell.taotie_fabel.status.max"
                              )
                            : Text.translate(
                                  "kubejs.spell.taotie_fabel.status.free_space",
                                  [
                                      player.persistentData
                                          .getDouble("consumedSpace")
                                          .toFixed(2),
                                      infinite ? "∞" : `${maxSpace.toFixed(2)}`,
                                  ]
                              )
                    )
                    .color(dragonMagicColor);
            }
            break;
    }
});

/**
 * @param {$Player_} ctx
 * @returns
 */
global.DRAGON_MAGIC.crafting = (player) => {
    return isDragon(player);
};

// console.log("-- @" + event.entity.scriptType);
// console.log("--- ON-CAST ---");
// console.log(event.entity ?? undefined);
// console.log(event.spellId ?? undefined);
// console.log(event.schoolType ?? undefined);
// console.log("Old Spell Level: " + event.originalSpellLevel ?? undefined);

// event.setSpellLevel(event.originalSpellLevel + 1);

// console.log("New Spell Level: " + event.spellLevel ?? undefined);
// console.log(event.castSource ?? undefined);

// console.log("Old Mana Cost: " + event.manaCost ?? undefined);
// event.setManaCost(event.manaCost + 1);
// console.log("New Mana Cost: " + event.manaCost ?? undefined);

//	console.log(event.entity.magicData ?? undefined)

// /**
//  * @param {$CustomSpell$CastContext_} ctx
//  * @returns
//  */
// global.DRAGON_MAGIC.taotieFabel_casted = (ctx) => {
//     let entity = ctx.getEntity?.toString();
//     console.log(ctx);
//     console.log(entity);
//     if (!entity) return;
//     console.log(entity);
//     if (!entity.isPlayer()) return;

//     entity.tell("i love you");
//     console.log(111);
//     //  event.server.getPlayers().forEach((player) => {
//     //      let oAABB = player.getBoundingBox().inflate(k);
//     //      event.server
//     //          .getLevel()
//     //          .getEntitiesWithin(oAABB)
//     //          .forEach((entity) => {
//     //              if (entity.type === "minecraft:skeleton") {
//     //                  player.playSound("kubejs:music.calm4", 1.0, 1.0); // With fixed volume and pitch
//     //              }
//     //          });
//     //  });
// };
