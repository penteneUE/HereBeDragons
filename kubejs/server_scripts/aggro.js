// let $Player = Java.loadClass("net.minecraft.world.entity.player.Player");
// //不会根本不会555555
// const $NearestAttackableTargetGoal = Java.loadClass(
//     "net.minecraft.world.entity.ai.goal.target.NearestAttackableTargetGoal"
// );
// function modifyAggro() {
//     const { STRUCTURE_DATA } = global;

//     const mobsToStructure = Utils.newMap();

//     STRUCTURE_DATA.forEach((structure, data) => {
//         const { mobs } = data;

//         if (!mobs) return;
//         mobs.forEach((thing) => {
//             if (!mobsToStructure.containsKey(thing)) {
//                 mobsToStructure[thing] = [structure];
//                 return;
//             }
//             console.log(STRUCTURE_DATA);
//             mobsToStructure[thing].push(structure);
//         });
//     });

//     console.log(mobsToStructure);
//     mobsToStructure.forEach((mobId) => {
//         EntityJSEvents.addGoals(mobId, (event) => {
//             if (event.)
//             event.removeGoal($NearestAttackableTargetGoal);
//             event.arbitraryTargetGoal(
//                 2,
//                 /**@param {Internal.PathfinderMob} mob */ (mob) =>
//                     new $NearestAttackableTargetGoal(
//                         mob,
//                         $Player,
//                         true,
//                         /**@param {Internal.Player} target */ (target) => {
//                             if (!target.isPlayer()) return true;

//                         }
//                     )
//             );
//         });
//     });

//     mobsToStructure.clear();
// }

// modifyAggro();
// let $Player = Java.loadClass("net.minecraft.world.entity.player.Player");

// const NearestAttackableTargetGoal = Java.loadClass(
//     "net.minecraft.world.entity.ai.goal.target.NearestAttackableTargetGoal"
// );
// let helmet = "minecraft:diamond_helmet";
// let chestplate = "minecraft:diamond_chestplate";
// let leggings = "minecraft:diamond_leggings";
// let boots = "minecraft:diamond_boots";
// EntityJSEvents.addGoals("minecraft:skeleton", (event) => {
//     event.removeGoal(NearestAttackableTargetGoal);
//     event.arbitraryTargetGoal(
//         2,
//         /**@param {Internal.PathfinderMob} mob */ (mob) =>
//             new NearestAttackableTargetGoal(
//                 mob,
//                 $Player,
//                 true,
//                 /**@param {Internal.Player} target */ (target) => {
//                     if (
//                         target.isPlayer() &&
//                         target.headArmorItem.id == helmet &&
//                         target.chestArmorItem.id == chestplate &&
//                         target.legsArmorItem.id == leggings &&
//                         target.feetArmorItem.id == boots
//                     ) {
//                         return false;
//                     }
//                     return true;
//                 }
//             )
//     );
//     // event.arbitraryTargetGoal(
//     //     3,
//     //     (mob) => new NearestAttackableTargetGoal(mob, IronGolem, true)
//     // );
//     // // Skeles apparently like killing baby turtles >.>
//     // event.arbitraryTargetGoal(
//     //     3,
//     //     (mob) =>
//     //         new NearestAttackableTargetGoal(
//     //             mob,
//     //             Turtle,
//     //             10,
//     //             true,
//     //             false,
//     //             Turtle.BABY_ON_LAND_SELECTOR
//     //         )
//     // );
// });
// This custom goal is required to make the skeleton de-aggro if you were to equip the armor after they've targeted you already
// If you want them to target you anyways after you've "revealed your identity" to them then remove the below event
// Also remove this event if you want them to attack back if you attack them first as their hurtByTarget goal depends on them having a target
// EntityJSEvents.addGoalSelectors("minecraft:skeleton", (event) => {
//     event.customGoal(
//         "resetSkeletonTarget",
//         1,
//         (m) => m.target != null,
//         (m) => m.target != null,
//         true,
//         (m) => {},
//         (m) => {},
//         true,
//         /**@param {Internal.Skeleton} mob */ (mob) => {
//             const { target } = mob;
//             if (target == null) return;

//             if (
//                 target.isPlayer() &&
//                 target.headArmorItem.id == helmet &&
//                 target.chestArmorItem.id == chestplate &&
//                 target.legsArmorItem.id == leggings &&
//                 target.feetArmorItem.id == boots
//             ) {
//                 mob.setTarget(null);
//             }
//         }
//     );
// });
