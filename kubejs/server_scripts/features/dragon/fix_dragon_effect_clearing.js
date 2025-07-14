const effectsToPreserveWithMilk = [
    "dragonsurvival:lava_vision",
    "dragonsurvival:animal_peace",
    "dragonsurvival:water_vision",
    "dragonsurvival:cave_fire",
    "dragonsurvival:forest_magic",
    "dragonsurvival:hunter",
    "dragonsurvival:sea_peace",
    "kubejs:reproduction_frenzy", // 繁衍狂热
    "kubejs:regenerator",
];
NativeEvents.onEvent(
    "net.neoforged.neoforge.event.entity.living.MobEffectEvent$Applicable",
    (
        /**@type {import("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Applicable").$MobEffectEvent$Applicable} */ event
    ) => {
        const $EffectCures = Java.loadClass(
            "net.neoforged.neoforge.common.EffectCures"
        );

        const { effectInstance, entity } = event;
        if (!entity.isPlayer()) return;
        if (!isDragon(entity)) return;
        if (!effectsToPreserveWithMilk.some((id) => effectInstance.is(id)))
            return;
        effectInstance.cures.remove($EffectCures.MILK);
    }
);

// global.Example$MobEffectEvent$Applicable = (
//     /**@type {Internal.MobEffectEvent$Applicable} */ event
// ) => {
//     const $EffectInstance = Java.loadClass(
//         "net.minecraft.world.effect.MobEffectInstance"
//     );
//     const { effectInstance } = event;
//     const curativeItems = event.effectInstance.curativeItems;
//     if (
//         effectsToClearWithMilk.some((effect) =>
//             new $EffectInstance(effect).effect.equals(effectInstance.effect)
//         )
//     )
//         return;
//     curativeItems.removeIf((item) => item.hasTag("forge:milk/milk"));
//     effectInstance.setCurativeItems(curativeItems);
// };
