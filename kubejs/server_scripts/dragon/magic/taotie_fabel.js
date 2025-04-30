/**
 *
 * @param {$SpellOnCastEventJS_} event
 * @returns
 */

function taotieFabel_onCast(event) {
    let player = event.entity;
    if (!player.isPlayer()) return;

    let growth = global.UTILS.dragonGrowth(player);

    let maxSpace =
        growth == -1 ? 1 : (Math.pow(event.spellLevel, 1.5) * growth) / 10;
    //let maxSpace = Math.pow(event.spellLevel, 1.5);
    let infinite = event.spellLevel > 10;

    let k = event.spellLevel * 8;

    if (player.shiftKeyDown) {
        if (!player.persistentData.consumedEntity) return;

        let blockHit = sightReachedBlock(player, event.level, k);
        let count = 0;
        let { x, y, z } = player;

        if (blockHit.getType() != HitResultType.MISS) {
            let loc = blockHit.getLocation();
            x = loc.x();
            y = loc.y();
            z = loc.z();
        }

        player.persistentData.consumedEntity.forEach((tag) => {
            let newEntity = event.level.createEntity(tag.getString("type"));
            newEntity.mergeNbt(tag.nbt);
            newEntity.x = x;
            newEntity.y = y;
            newEntity.z = z;
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
            if (player.persistentData.getDouble("consumedSpace") >= maxSpace) {
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
        //console.log(entity.boundingBox.getSize());

        entity.discard();
        count++;

        //entity.teleportTo(player);
    });

    if (!infinite) {
        if (player.persistentData.getDouble("consumedSpace") >= maxSpace) {
            isMax = true;
        }
        // console.log(`${entity.type}↓`);
        // console.log(entity.boundingBox.getSize());
    }
    //player.persistentData.putDouble("consumedSpace", consumedSpace);

    player.statusMessage = Text.translate(
        "kubejs.spell.taotie_fabel.status.in",
        [Utils.parseInt(count, 0)]
    )
        .append(
            isMax
                ? Text.translate("kubejs.spell.taotie_fabel.status.max")
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
