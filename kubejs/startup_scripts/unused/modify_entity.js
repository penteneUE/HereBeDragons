// let $ModifyLivingEntityBuilder = Java.loadClass(
//     "net.liopyu.entityjs.builders.modification.ModifyLivingEntityBuilder"
// );
// EntityJSEvents.modifyEntity((event) => {
//     event.modify("minecraft:zombie", (modifyBuilder) => {
//         // Since zombies extend the PathfinderMob class, a ModifyPathfinderMobBuilder will be provided
//         modifyBuilder
//             .isAlliedTo((context) => {
//                 const { entity, target } = context;
//                 try {
//                     return target.type == "minecraft:player";
//                 } catch (error) {
//                     console.log(error);
//                     return false;
//                 }
//             })
//             .canAttack((context) => {
//                 try {
//                     return {};
//                 } catch (error) {
//                     console.log(error);
//                 }
//             });
//     });
// });
