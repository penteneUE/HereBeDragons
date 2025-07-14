/**
 *
 * @param {$LivingEntity_} entity
 * @returns {boolean}
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
    console.log(healAmount);
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

EntityEvents.beforeHurt("minecraft:player", multiscaleBeforeHurt);
EntityEvents.beforeHurt("iceandfire:fire_dragon", multiscaleBeforeHurt);
EntityEvents.beforeHurt("iceandfire:ice_dragon", multiscaleBeforeHurt);
EntityEvents.beforeHurt("iceandfire:lightning_dragon", multiscaleBeforeHurt);

EntityEvents.beforeHurt(toughClawsBeforeHurt);

ItemEvents.entityInteracted(
    "iceandfire:dragon_horn",
    regeneratorDragonInteracted
);
NativeEvents.onEvent($MobEffectEvent$Remove, regeneratorPlayerHeal);
NativeEvents.onEvent($MobEffectEvent$Expired, regeneratorPlayerHeal);
EntityEvents.afterHurt("minecraft:player", regeneratorPlayerAfterHurt);
