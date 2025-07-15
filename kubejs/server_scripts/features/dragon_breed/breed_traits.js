/**
 *
 * @param {$LivingEntity_} entity
 * @returns {entity is $Player_ | entity is $EntityDragonBase_}
 */
function isTraitedEntity(entity) {
    return entity.isPlayer() || isIAFDragon(entity);
}

/**
 * @param {$BeforeLivingEntityHurtKubeEvent_ & {entity: $LivingEntity_}} event
 */
function multiscaleBeforeHurt(event) {
    let { entity } = event;
    // console.log(getTraitFromEntity(entity, "multiscale"));

    if (getTraitFromEntity(entity, "multiscale") < 1) return;
    // console.log(entity.health);
    // console.log(entity.maxHealth);
    if (entity.health < entity.maxHealth) return;
    switch (getTraitFromEntity(entity, "multiscale")) {
        case 1:
            event.setDamage((event.damage * 7) / 10);
            return;
        case 2:
            event.setDamage((event.damage * 6) / 10);
            return;
        case 3:
            event.setDamage((event.damage * 4) / 10);
            return;
        case 4:
            event.setDamage((event.damage * 2) / 10);
            return;
    }
}

/**
 * @param {$BeforeLivingEntityHurtKubeEvent_ & {entity: $LivingEntity_}} event
 */
function toughClawsBeforeHurt(event) {
    let {
        source,
        source: { actual },
    } = event;
    if (!actual) return;
    if (!source.direct) return;
    if (!isTraitedEntity(actual)) return;

    if (getTraitFromEntity(actual, "tough_claws") < 1) return;

    switch (getTraitFromEntity(entity, "multiscale")) {
        case 1:
            event.setDamage((event.damage * 11) / 10);
            return;
        case 2:
            event.setDamage((event.damage * 12) / 10);
            return;
        case 3:
            event.setDamage((event.damage * 14) / 10);
            return;
        case 4:
            event.setDamage((event.damage * 18) / 10);
            return;
    }
}

/**
 *
 * @param {$ItemEntityInteractedKubeEvent_ & {target: $LivingEntity_}} event
 * @returns
 */
function regeneratorDragonInteracted(event) {
    let { target } = event;
    if (!isIAFDragon(target)) return;
    // console.log(target);
    if (getTraitFromEntity(target, "regenerator") < 1) return;
    // console.log(target);
    let healAmount = 0;
    switch (getTraitFromEntity(target, "regenerator")) {
        case 1:
            healAmount = (target.maxHealth * 4) / 100;
            break;
        case 2:
            healAmount = (target.maxHealth * 1) / 10;
            break;
        case 3:
            healAmount = (target.maxHealth * 2) / 10;
            break;
        case 4:
            healAmount = (target.maxHealth * 4) / 10;
            break;
    }
    //console.log(healAmount);
    target.heal(healAmount);
}

const $MobEffectEvent$Remove = Java.loadClass(
    "net.neoforged.neoforge.event.entity.living.MobEffectEvent$Remove"
);
const $MobEffectEvent$Expired = Java.loadClass(
    "net.neoforged.neoforge.event.entity.living.MobEffectEvent$Expired"
);

/**
 *
 * @param {$MobEffectEvent$Remove_ | $MobEffectEvent$Expired_} event
 */
function regeneratorPlayerHeal(event) {
    let { effectInstance, entity } = event;
    if (!entity.isPlayer()) return;
    if (!effectInstance.is("kubejs:regenerator")) return;

    let healAmount = 0;
    switch (getTraitFromEntity(entity, "regenerator")) {
        case 1:
            healAmount = (entity.maxHealth * 1) / 10;
            break;
        case 2:
            healAmount = (entity.maxHealth * 2) / 10;
            break;
        case 3:
            healAmount = (entity.maxHealth * 4) / 10;
            break;
        case 4:
            healAmount = (entity.maxHealth * 8) / 10;
            break;
    }
    entity.heal(healAmount);
}

/**
 *
 * @param {$AfterLivingEntityHurtKubeEvent_  & {entity: $LivingEntity_}} event
 */
function regeneratorPlayerAfterHurt(event) {
    let { entity } = event;
    if (getTraitFromEntity(entity, "regenerator") < 1) return;

    // entity.hasEffect("kubejs:regenerator")
    entity.potionEffects.add("kubejs:regenerator", 60, 1, false, true);
}

/**
 * @type {$HashMap_<$UUID_, $UUID_>} 玩家UUID对实体UUID
 */
const stopouchInteractMap = Utils.newMap();

/**
 *
 * @param {$ItemEntityInteractedKubeEvent_ & {target: $LivingEntity_}} event
 * @returns
 */
function stopouchLeadEntityInteracted(event) {
    let { entity, target, player } = event;
    // if (!player.isPlayer()) return;
    if (isIAFDragon(target)) {
        if (getTraitFromEntity(target, "stopouch") < 1) return;
        if (player.shiftKeyDown) {
            //console.log(target);
            if (!target.persistentData.consumedEntity) return;
            let { x, y, z } = target;
            target.persistentData.consumedEntity.forEach((tag) => {
                // let newplayer = event.level.createplayer(tag.getString("type"));
                // newplayer.mergeNbt(tag.nbt);
                let newEntity = recoverConsumedEntity(event.level, tag);
                newEntity.x = x;
                newEntity.y = y;
                newEntity.z = z;
                //newplayer.setPosition(player.x, player.y, player.z);
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

                /**
                 * @type {$Player_}
                 */
                let owner = target.getOwner();
                if (owner)
                    owner.statusMessage = Text.translate(
                        "kubejs.status.traits.stopouch.out",
                        [target.displayName, newEntity.displayName]
                    );
            });
            target.persistentData.remove("consumedEntity");
            event.cancel();
            return;
        }
        // console.log(stopouchInteractMap);
        if (!stopouchInteractMap.containsKey(player.uuid.toString())) return;
        let foundEntity = event.level.getEntityByUUID(
            stopouchInteractMap[player.uuid]
        );
        // console.log(foundEntity);
        if (!foundEntity || !foundEntity.alive) return;
        if (target.distanceToEntity(foundEntity) > 20) return;

        if (!target.persistentData.consumedEntity) {
            target.persistentData.consumedEntity = new $ListTag();
        }

        target.persistentData.consumedEntity.addLast(
            createConsumedEntityTag(foundEntity)
        );

        /**
         * @type {$Player_}
         */
        let owner = target.getOwner();
        if (owner)
            owner.statusMessage = Text.translate(
                "kubejs.status.traits.stopouch.in",
                [target.displayName, foundEntity.displayName]
            );

        foundEntity.discard();

        event.server.runCommandSilent(
            `/playsound minecraft:item.honey_bottle.drink player ${owner.username.toString()} ${
                target.x
            } ${target.y} ${target.z}`
        );
        stopouchInteractMap.remove(player.uuid);
        event.cancel();
        return;
    }
    if (target.isLiving()) stopouchInteractMap[player.uuid] = target.uuid;
}

// 多鳞
EntityEvents.beforeHurt("minecraft:player", multiscaleBeforeHurt);
EntityEvents.beforeHurt("iceandfire:fire_dragon", multiscaleBeforeHurt);
EntityEvents.beforeHurt("iceandfire:ice_dragon", multiscaleBeforeHurt);
EntityEvents.beforeHurt("iceandfire:lightning_dragon", multiscaleBeforeHurt);

// 硬爪
EntityEvents.beforeHurt(toughClawsBeforeHurt);

// 再生
ItemEvents.entityInteracted(
    "iceandfire:dragon_horn",
    regeneratorDragonInteracted
);
NativeEvents.onEvent($MobEffectEvent$Remove, regeneratorPlayerHeal);
NativeEvents.onEvent($MobEffectEvent$Expired, regeneratorPlayerHeal);
EntityEvents.afterHurt("minecraft:player", regeneratorPlayerAfterHurt);

// 胃袋
ItemEvents.entityInteracted("minecraft:lead", stopouchLeadEntityInteracted);
