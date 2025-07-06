let $Mob = Java.loadClass("net.minecraft.world.entity.Mob");

/**
 * @type {$Map_<$UUID_, {power: number, target: $Entity_}>}
 */

let anantaRemantaData = Utils.newMap();
let catchBlackList = Utils.newList();
catchBlackList.addAll([
    "minecraft:ender_dragon",
    "iceandfire:fire_dragon",
    "iceandfire:ice_dragon",
    "iceandfire:lightning_dragon",
]);

let spellTriggerCount = 12;

/**
 *
 * @param {number} base
 * @param {integer} power
 * @returns {number}
 */
function calcSuccessRate(base, power) {
    return Math.max(1, (base * power) / spellTriggerCount);
}

/**
 *
 * @param {$SpellPreCastEventJS_} event
 * @returns
 */

function anantaRemanta_preCast(event) {
    let { captureHealth, failureRate, growth } =
        global.DRAGON_MAGIC.anantaRemanta_info(event.spellLevel, event.entity);

    // console.log(captureHealth);
    // console.log(failureRate);
    // console.log(growth);
    function isMinion() {
        player.statusMessage = Text.translate(
            "kubejs.spell.ananta_remanta.status.isminion",
            [Text.gold(target.displayName)]
        ).color(dragonMagicColor);
        event.cancel();
    }
    let player = event.entity;
    let level = event.level;
    if (!player.isPlayer()) return;
    // let eyePos = player.getEyePosition(1.0);
    // let lookVec = player.getLookAngle();

    let target = sightReachedEntity(player, level, 40);

    if (!target) {
        player.statusMessage = Text.translate(
            "kubejs.spell.ananta_remanta.status.notarget"
        ).color(dragonMagicColor);
        event.cancel();
        return;
    }

    if (!(target instanceof $Mob) || catchBlackList.contains(target.type)) {
        player.statusMessage = Text.translate(
            "kubejs.spell.ananta_remanta.status.cantcatch"
        ).color(dragonMagicColor);
        event.cancel();
        return;
    }

    if (target instanceof $TamableAnimal && target.isOwnedBy(player)) {
        isMinion();
        return;
    }

    if (
        target.persistentData.OwnerName &&
        target.persistentData.OwnerName == player.getUuid().toString()
    ) {
        isMinion();
        return;
    }

    let fixedCaptureHealth = Utils.parseInt(
        (captureHealth * target.maxHealth) / 100,
        2
    );

    if (fixedCaptureHealth < 2) fixedCaptureHealth = 2;

    if (fixedCaptureHealth < Math.floor(target.health)) {
        player.statusMessage = Text.translate(
            "kubejs.spell.ananta_remanta.status.toohealthy",
            [(fixedCaptureHealth / 2).toFixed(1)]
        ).color(dragonMagicColor);
        event.cancel();
        return;
    }

    anantaRemantaData[player.getUuid().toString()] = {
        power: 0,
        target: target,
    };

    player.statusMessage = Text.translate(
        "kubejs.spell.ananta_remanta.status.targeted",
        [
            Text.gold(target.displayName),
            calcSuccessRate(100 - failureRate, 0).toFixed(1),
        ]
    ).color(dragonMagicColor);
}

/**
 *
 * @param {$SpellOnCastEventJS_} event
 * @returns
 */

function anantaRemanta_onCast(event) {
    let player = event.entity;
    if (!player.isPlayer()) return;

    if (!anantaRemantaData[player.getUuid().toString()]) {
        event.cancel();
        return;
    }
    anantaRemantaData[player.getUuid().toString()].power++;

    let target = anantaRemantaData[player.getUuid().toString()].target;
    let power = anantaRemantaData[player.getUuid().toString()].power;

    let center = target.getBoundingBox().center;

    event.level.spawnParticles(
        "minecraft:campfire_cosy_smoke",
        true,
        center.x(),
        center.y(),
        center.z(),
        0,
        0.3,
        0,
        2,
        0.1
    );

    let { captureHealth, failureRate, growth } =
        global.DRAGON_MAGIC.anantaRemanta_info(event.spellLevel, event.entity);

    let successRate = calcSuccessRate(100 - failureRate, power);

    player.statusMessage = Text.translate(
        "kubejs.spell.ananta_remanta.status.targeted",
        [
            Text.gold(target.displayName),
            Text.of(successRate.toFixed(1)).color(
                lerpColor("#967CA6", "#00FFFF", power / spellTriggerCount)
            ),
        ]
    ).color(dragonMagicColor);
}

/**
 *
 * @param {$SpellPostCastEventJS_} event
 * @returns
 */

function anantaRemanta_postCast(event) {
    let player = event.entity;
    if (!player.isPlayer()) return;

    if (!anantaRemantaData[player.getUuid().toString()]) {
        event.cancel();
        return;
    }
    let { target, power } = anantaRemantaData[player.getUuid().toString()];

    anantaRemantaData.remove(player.getUuid().toString());

    let { failureRate } = global.DRAGON_MAGIC.anantaRemanta_info(
        event.spellLevel,
        event.entity
    );

    let successRate = calcSuccessRate(100 - failureRate, power);

    //console.log(successRate);

    if (Math.random() * 100 > successRate) {
        player.statusMessage = Text.translate(
            "kubejs.spell.ananta_remanta.status.fail"
        ).red();
        // event.level.playSound(
        //     player,
        //     player.blockPosition(),
        //     "entity.generic.explode",
        //     "players"
        // );
        event.server.runCommandSilent(
            `/playsound minecraft:entity.generic.explode player ${player.username.toString()} ${
                player.x
            } ${player.y} ${player.z}`
        );

        let center = target.getBoundingBox().center;

        event.level.spawnParticles(
            "minecraft:explosion",
            true,
            center.x(),
            center.y(),
            center.z(),
            0,
            0.3,
            0,
            2,
            0.1
        );
        return;
    }

    event.server.runCommandSilent(
        `/playsound minecraft:entity.wither.death player ${player.username.toString()} ${
            player.x
        } ${player.y} ${player.z}`
    );

    const { boundingBox } = target;
    //spawnParticles(ParticleOptions options, boolean overrideLimiter, double x, double y, double z, double vx, double vy, double vz, int count, double speed)
    //let location = Utils.newList();
    for (let i = boundingBox.minX; i < boundingBox.maxX; i += 0.5) {
        for (let j = boundingBox.minY; j < boundingBox.maxY; j += 0.5) {
            for (let k = boundingBox.minZ; k < boundingBox.maxZ; k += 0.5) {
                event.level.spawnParticles(
                    "minecraft:soul",
                    true,
                    i,
                    j,
                    k,
                    0,
                    0.3,
                    0,
                    1,
                    0.1
                );
            }
        }
    }

    let type = target.type;
    let nbt = target.nbt.copy();

    target.die(player);
    target.kill();

    let newEntity = event.level.createEntity(type);
    newEntity.mergeNbt(nbt);
    newEntity.x = target.x;
    newEntity.y = target.y;
    newEntity.z = target.z;

    newEntity.setUUID(UUID.fromString(randomUUID()));
    newEntity.health = newEntity.maxHealth;

    newEntity.spawn();

    tameCreature(player, newEntity);

    //target.discard();

    player.statusMessage = Text.translate(
        "kubejs.spell.ananta_remanta.status.success"
    ).aqua();

    // player.tell(
    //     `power: ${spellData.power}, target: ${spellData.target.displayName}`
    // );
}
