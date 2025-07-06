//priority: 2
/**
 * @param {$Entity_} entity
 * @param {$ServerLevel_} level
 * @param {number} reach
 * @returns {$BlockHitResult_}
 */
function sightReachedBlock(entity, level, reach) {
    let eyePos = entity.getEyePosition(1.0);
    let lookVec = entity.getLookAngle();
    let end = eyePos.add(
        lookVec.x() * reach,
        lookVec.y() * reach,
        lookVec.z() * reach
    );
    let blockHit = level.clip(
        new ClipContext(
            eyePos,
            end,
            ClipContext.Block.OUTLINE,
            ClipContext.Fluid.NONE,
            entity
        )
    );
    // if (blockHit.getType() != HitResultType.MISS) {
    //     end = blockHit.getLocation();
    // }
    return blockHit;
}

/**
 * @param {$Entity_} entity
 * @param {$ServerLevel_} level
 * @param {number} reach
 * @returns {$Entity_}
 */
function sightReachedEntity(entity, level, reach) {
    let eyePos = entity.getEyePosition(1.0);
    let lookVec = entity.getLookAngle();

    let end = eyePos.add(
        lookVec.x() * reach,
        lookVec.y() * reach,
        lookVec.z() * reach
    );
    let blockHit = level.clip(
        new ClipContext(
            eyePos,
            end,
            ClipContext.Block.OUTLINE,
            ClipContext.Fluid.NONE,
            entity
        )
    );
    if (blockHit.getType() != HitResultType.MISS) {
        end = blockHit.getLocation();
    }
    let aabb = AABB.of(
        eyePos.x(),
        eyePos.y(),
        eyePos.z(),
        end.x(),
        end.y(),
        end.z()
    ).inflate(1);
    let closestDistance = reach;
    let result = null;
    level.getEntitiesWithin(aabb).forEach((foundEntity) => {
        if (result != null) return;
        if (foundEntity != entity) {
            let dist = eyePos.distanceTo(foundEntity.getEyePosition(1.0));
            if (dist < closestDistance) {
                result = foundEntity;
                return;
            }
        }
    });
    return result;
}
