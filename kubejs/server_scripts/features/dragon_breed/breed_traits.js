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

EntityEvents.beforeHurt("minecraft:player", multiscaleBeforeHurt);
EntityEvents.beforeHurt("iceandfire:fire_dragon", multiscaleBeforeHurt);
EntityEvents.beforeHurt("iceandfire:ice_dragon", multiscaleBeforeHurt);
EntityEvents.beforeHurt("iceandfire:lightning_dragon", multiscaleBeforeHurt);
