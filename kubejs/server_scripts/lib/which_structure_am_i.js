//priority: 3

/**
 *
 * @param {$BlockPos_} blockPosition
 * @param {$ServerLevel_} level
 * @returns {{structure: $StructureStart_, structure_id: string}}
 */
function whichStructureAmI(blockPosition, level) {
    let structure;
    let structure_id = "";
    level
        .structureManager()
        .startsForStructure($ChunkPos(blockPosition), () => true)
        .stream()
        .forEach((ss) => {
            if (ss.getBoundingBox().isInside(blockPosition)) {
                structure_id = Registry.of("worldgen/structure")
                    .getKey(ss.getStructure())
                    .location();
                structure = ss;

                return;
            }
        });
    // if (structure_id == "minecraft:mansion") {
    //     console.log(blockPosition);
    // }
    return { structure: structure, structure_id: structure_id };
}

global.UTILS.whichStructureAmI = whichStructureAmI;
