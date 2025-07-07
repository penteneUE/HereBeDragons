// //credit: based on scripts by Beubeu and Uncandango
// //Import Pehkui API
// const $ScaleTypes = Java.loadClass("virtuoel.pehkui.api.ScaleTypes");
// // const $MobEffectEvent$Remove = Java.loadClass(
// //     "net.minecraftforge.event.entity.living.MobEffectEvent.Remove"
// // );
// // const $MobEffectEvent$Expired = Java.loadClass(
// //     "net.minecraftforge.event.entity.living.MobEffectEvent.Expired"
// // );
// const $MobEffectEvent$Remove = Java.loadClass(
//     "net.neoforged.neoforge.event.entity.living.MobEffectEvent$Remove"
// );
// const $MobEffectEvent$Expired = Java.loadClass(
//     "net.neoforged.neoforge.event.entity.living.MobEffectEvent$Expired"
// );


// NativeEvents.onEvent($MobEffectEvent$Remove, (event) => {
//     global.clearEffects(event.entity, event.effectInstance);
// });

// NativeEvents.onEvent($MobEffectEvent$Expired, (event) => {
//     global.clearEffects(event.entity, event.effectInstance);
// });

// StartupEvents.registry("mob_effect", (event) => {
//     event
//         .create("goblin_mode")
//         .effectTick((entity, level) => global.shrink(entity, level))
//         .color(Color.GREEN)
//         .beneficial()
//         .displayName("Goblin Mode");
// });

// global.shrink = (
//     /** @type {$LivingEntity_} */ entity,
//     /** @type {number} */ lvl
// ) => {
//     if (entity.isPlayer()) {
//         // If effect is active, shrink
//         let scale = entity.hasEffect("kubejs:goblin_mode") ? 0.5 : 1.0;
//         $ScaleTypes.HEIGHT.getScaleData(entity).setScale(scale);
//         $ScaleTypes.WIDTH.getScaleData(entity).setScale(scale);
//     }
// };


// global.clearEffects = (
//     /** @type {$LivingEntity_} */ entity,
//     /** @type {$MobEffectInstance_} */ effectInstance
// ) => {
//     if (effectInstance.effect.descriptionId == "effect.kubejs.goblin_mode") {
//         if (entity.isPlayer()) {
//             entity.mergeNbt({
//                 "pehkui:scale_data_types": {
//                     "pehkui:height": {
//                         scale: 1.0,
//                     },
//                     "pehkui:width": {
//                         scale: 1.0,
//                     },
//                 },
//             });
//         }
//     }
// };
