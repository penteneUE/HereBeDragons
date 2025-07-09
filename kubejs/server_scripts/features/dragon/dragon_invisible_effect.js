const $MobEffectEvent$Added = Java.loadClass(
    "net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added"
);

// const $MobEffectEvent$Remove = Java.loadClass(
//     "net.neoforged.neoforge.event.entity.living.MobEffectEvent$Remove"
// );
// const $MobEffectEvent$Expired = Java.loadClass(
//     "net.neoforged.neoforge.event.entity.living.MobEffectEvent$Expired"
// );

NativeEvents.onEvent($MobEffectEvent$Added, (event) => {
    let { effectInstance, entity } = event;
    if (!entity.isPlayer()) return;
    if (!effectInstance.is("dragonsurvival:hunter")) return;

    //entity.addEffect("irons_spellbooks:true_invisibility");
    entity.potionEffects.add(
        "irons_spellbooks:true_invisibility",
        Math.floor(effectInstance.duration / 2),
        1,
        false,
        true
    );
});
