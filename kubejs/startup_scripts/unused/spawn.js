// EntityJSEvents.spawnPlacement((event) => {
//     event.or(
//         "minecraft:pillager",
//         (entitypredicate, levelaccessor, spawntype, blockpos, randomsource) => {
//             if (levelaccessor.clientSide) return;
//             if (levelaccessor.level.dimension != "minecraft:overworld") return;

//             let { structure_id } = global.UTILS.whichStructureAmI(
//                 blockpos,
//                 levelaccessor.level
//             );

//             switch (structure_id) {
//                 case "minecraft:mansion":
//                     return true;
//             }
//             return false;
//         }
//     );
// });
//md，没有用
