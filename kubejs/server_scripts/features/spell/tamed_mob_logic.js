let $TamableAnimal = Java.loadClass("net.minecraft.world.entity.TamableAnimal");
let $NearestAttackableTargetGoal = Java.loadClass(
    "net.minecraft.world.entity.ai.goal.target.NearestAttackableTargetGoal"
);

// let $DefendVillageTargetGoal = Java.loadClass(
//     "net.minecraft.world.entity.ai.goal.target.DefendVillageTargetGoal"
// );
let $HurtByTargetGoal = Java.loadClass(
    "net.minecraft.world.entity.ai.goal.target.HurtByTargetGoal"
);
// let SpiderTargetGoal = Java.loadClass(
//     "net.minecraft.world.entity.monster.Spider$SpiderTargetGoal"
// );
let MeleeAttackGoal = Java.loadClass(
    "net.minecraft.world.entity.ai.goal.MeleeAttackGoal"
);

let $RangedAttackGoal = Java.loadClass(
    "net.minecraft.world.entity.ai.goal.RangedAttackGoal"
);
let $RangedBowAttackGoal = Java.loadClass(
    "net.minecraft.world.entity.ai.goal.RangedBowAttackGoal"
);

let $RangedCrossbowAttackGoal = Java.loadClass(
    "net.minecraft.world.entity.ai.goal.RangedCrossbowAttackGoal"
);
let PathfinderMob = Java.loadClass("net.minecraft.world.entity.PathfinderMob");
//let IronGolem = Java.loadClass("net.minecraft.world.entity.animal.IronGolem");
let LivingEntity = Java.loadClass("net.minecraft.world.entity.LivingEntity");
let $CustomGoal = Java.loadClass("net.liopyu.entityjs.util.ai.CustomGoal");
let Player = Java.loadClass("net.minecraft.world.entity.player.Player");
//let FlyingMob = Java.loadClass("net.minecraft.world.entity.FlyingMob");
//let TamableAnimal = Java.loadClass("net.minecraft.world.entity.TamableAnimal");
let ClipContext = Java.loadClass("net.minecraft.world.level.ClipContext");
let HitResultType = Java.loadClass("net.minecraft.world.phys.HitResult$Type");
/**
 * Maps entity types to the item required to tame them.
 *
 * This list controls which mobs can be tamed during gameplay and
 * what item is needed to tame each.
 *
 */
// let tameableMobs = new Set();

// global.STRUCTURE_DATA.forEach((structure, data) => {
//     const { mobs } = data;
//     mobs.forEach((mobType) => {
//         if (!tameableMobs.has(mobType)) tameableMobs.add(mobType);
//     });
// });
// let tameableMobs = {
//     "minecraft:spider": "minecraft:diamond",
// };
/**
 * @param {$Player_} player
 * @param {$Entity_} target
 */
function tameCreature(player, target) {
    if (!target.hasCustomName()) {
        target.setCustomName(
            Text.translate("kubejs.entity.minion", [player.username.toString()])
        );
    }
    target.persistentData.OwnerName = player.getUuid().toString();
    let tag = new $CompoundTag();
    tag.putBoolean("PersistenceRequired", true);
    target.mergeNbt(tag);
    reviseTamedPetGoals(target);
}

/**
 * Gets the owner of a mob from its persistent data.
 * @param {$Mob_} mob The mob entity.
 * @returns {$Player_ | null} The owner player entity, or null if not found.
 */
function getOwner(mob) {
    if (!mob.persistentData) return null;
    if (!mob.persistentData.OwnerName) return null;
    try {
        //let ownerUUID = UUID.fromString(mob.persistentData.OwnerName);
        let owner;

        let playerList = mob.getServer().playerList.getPlayers().iterator();
        while (playerList.hasNext()) {
            let player = playerList.next();
            if (player.getUuid().toString() == mob.persistentData.OwnerName) {
                owner = player;
            }
        }
        return owner;
    } catch (e) {
        return null;
    }
}

/**
 *
 * @param {$Mob_} mob
 * @returns {string | null}
 */
// function getOwnerNameOrNull(mob) {
//         if (!mob.persistentData.OwnerName) return null;
//         return mob.persistentData.OwnerName;
//     }

/**
 * Checks if an entity is a pet of a given player.
 * @param {$LivingEntity_} entity The potential pet entity.
 * @param {$Player_} owner The potential owner.
 * @returns {boolean} True if the entity is a pet of the owner, false otherwise.
 */
function isPetOf(entity, owner) {
    if (!entity || !owner) return false;
    if (
        entity.persistentData.OwnerName &&
        entity.persistentData.OwnerName == owner.getUuid().toString()
    ) {
        return true;
    }
    if (entity instanceof $TamableAnimal && entity.isOwnedBy(owner)) {
        return true;
    }
    return false;
}

/**
 *
 * @param {$LivingEntity_} mob
 * @param {$LivingEntity_} target
 * @returns {boolean}
 */
function tamedCreatureSelfDefend(mob, target) {
    if (!target || !target.isAlive()) return false;
    let owner = getOwner(mob);
    if (target.getUuid() == owner.getUuid() || isPetOf(target, owner))
        return false;
    return true;
}

/**
 *
 * @param {$LivingEntity_} mob
 * @param {$LivingEntity_} target
 * @returns {boolean}
 */
function tamedCreatureLogic(mob, target) {
    try {
        if (!target || !target.isAlive()) return false;
        let owner = getOwner(mob);
        if (target.getUuid() == owner.getUuid() || isPetOf(target, owner))
            return false;
        // 我他妈就搞不懂你就这么喜欢const？？？
        let ownerData = owner.persistentData;
        let lastAttackedId = ownerData.lastAttackedMobId;
        let lastAttackedMeId = ownerData.lastMobToAttackMe;
        let targetId = target.getUuid().toString();

        // console.log(
        //     `[Pet AI] Pet: ${mob.type}, Target: ${target.type}, Owner: ${owner.displayName.string}`
        // );
        // console.log(`[Pet AI] Owner's lastAttacked: ${lastAttackedId}`);
        // console.log(`[Pet AI] Owner's lastAttackedBy: ${lastAttackedMeId}`);
        // console.log(`[Pet AI] Current Target ID: ${targetId}`);

        if (lastAttackedId && lastAttackedId == targetId) {
            let entityRef = mob.level.getEntity(target.id);
            if (
                entityRef &&
                entityRef.isAlive() &&
                entityRef.distanceToEntity(owner) < 60
            ) {
                // console.log(`[Pet AI] DECISION: Attacking target of owner.`);
                return true;
            } else {
                ownerData.remove("lastAttackedMobId");
            }
        }

        if (lastAttackedMeId && lastAttackedMeId == targetId) {
            let entityRef = mob.level.getEntity(target.id);
            if (
                entityRef &&
                entityRef.isAlive() &&
                entityRef.distanceToEntity(owner) < 60
            ) {
                // console.log(`[Pet AI] DECISION: Attacking threat to owner.`);
                return true;
            } else {
                ownerData.remove("lastMobToAttackMe");
            }
        }

        return false;
    } catch (e) {
        // console.log("Error in tamedCreatureLogic: " + e);
        return false;
    }
}

/**
 * Resets and reapplies the defensive targeting behavior for tamed mobs.
 *
 * - Removes existing `NearestAttackableTargetGoal`s to prevent unwanted aggression.
 * - Re-adds a filtered goal that only targets:
 *   - The last mob attacked by the owner.
 *   - The last mob that attacked the owner.
 * - Ignores other tamed mobs and the owner.
 *
 * Also called on entity spawn to restore tame behavior.
 */
function reviseTamedPetGoals(mob) {
    let owner = getOwner(mob);
    if (owner && owner.persistentData.getBoolean(CASTER_DATA_KEY)) {
        updateBreedAttributes(mob, owner.persistentData[BREED_DATA_KEY]);
    }

    if (!(mob instanceof PathfinderMob)) return;

    // simply stop all goals to reset aggro
    mob.targetSelector.getAvailableGoals().forEach((goal) => {
        if (!goal.running) return;
        goal.stop();
    });
    // here we remove all nearest attackable target goals so it doesnt attack us or other mobs on sight
    // the entity goal to remove will vary depending on the mob tamed, so you may need to add more cases for other mobs
    // mob.targetSelector.removeAllGoals(
    //     (goal) =>
    //         goal instanceof $NearestAttackableTargetGoal ||
    //         goal.goal instanceof $NearestAttackableTargetGoal
    // );
    // mob.targetSelector.removeAllGoals(
    //     (goal) =>
    //         goal instanceof $HurtByTargetGoal ||
    //         goal.goal instanceof $HurtByTargetGoal
    // );
    mob.targetSelector.removeAllGoals((goal) => true);

    // if (
    //     mob.goalSelector.availableGoals.some(
    //         (goal) => goal.goal instanceof MeleeAttackGoal
    //     ) ||
    //     mob.goalSelector.availableGoals.some(
    //         (goal) => goal.goal instanceof $RangedAttackGoal
    //     ) ||
    //     mob.goalSelector.availableGoals.some(
    //         (goal) => goal.goal instanceof $RangedBowAttackGoal
    //     )
    // ) {
    // re-add the NearestAttackableTargetGoal & HurtByTargetGoal to make it only attack the last entity the player attacked
    mob.server.scheduleInTicks(1, () => {
        mob.targetSelector.addGoal(
            0,
            new $NearestAttackableTargetGoal(
                mob,
                LivingEntity,
                1,
                true,
                false,
                (t) => tamedCreatureLogic(mob, t)
            )
        );

        mob.targetSelector.addGoal(1, new $HurtByTargetGoal(mob, Player));

        mob.goalSelector.addGoal(
            3,
            new $CustomGoal(
                "follow_owner_dragon",
                mob,
                (mob) => {
                    // 使用随机数降低检查频率
                    return mob.getRandom().nextInt(100) < 5;
                },
                (mob) => true,
                true,
                (mob) => {},
                (mob) => mob.getNavigation().stop(),
                true,
                /** @param {$Mob_} mob */ (mob) => {
                    if (!mob) return;
                    if (!mob.persistentData) return;
                    let owner = getOwner(mob);
                    if (!owner) return;
                    if (
                        !owner.persistentData.getBoolean(
                            TOGGLE_PET_FOLLOWING_KEY
                        )
                    )
                        return;
                    let dist = mob.distanceToEntity(owner);
                    if (dist > 24) return;
                    if (dist < 3) return;
                    //if (mob.tickCount % 60 != 0) return;
                    //let mobAABB = mob.boundingBox.inflate(5);
                    mob.getNavigation().moveTo(
                        owner.block.x,
                        owner.y,
                        owner.z,
                        1.0
                    );
                    /*                    mob.level.getEntitiesWithin(mobAABB).forEach((entity) => {
                        if (entity == null) return;
                        if (
                            entity.player &&
                            isPetOf(mob, entity) &&
                            entity.distanceToEntity(mob) < 20
                        ) {
                            mob.getNavigation().moveTo(
                                entity.block.x,
                                entity.y,
                                entity.z,
                                1.0
                            );
                        }
                    });*/
                }
            )
        );
        // console.log(`[Pet AI] Pet: ${mob.type}, Revised Pet Goals`);
    });
    //}
}

// function debugEntityGoals(entity) {
//     // console.log("=== Goal Selector ===");
//     entity.goalSelector.getAvailableGoals().forEach(goalWrapper => {
//         const goal = goalWrapper.getGoal();
//         const priority = goalWrapper.getPriority();
//         const isRunning = goalWrapper.isRunning();
//         // console.log(`Priority ${priority}: ${goal} (${isRunning ? "运行中" : "未激活"})`);
//     });

//     // console.log("=== Target Selector ===");
//     entity.targetSelector.getAvailableGoals().forEach(goalWrapper => {
//         const goal = goalWrapper.getGoal();
//         const priority = goalWrapper.getPriority();
//         const isRunning = goalWrapper.isRunning();
//         // console.log(`Priority ${priority}: ${goal} (${isRunning ? "运行中" : "未激活"})`);
//     });
// }

// // 在游戏中使用调试命令
// ItemEvents.entityInteracted(event => {
//     const { target: entity, player, hand } = event;
//     if (hand === "MAIN_HAND" && player.getMainHandItem().id === "minecraft:stick") {
//         debugEntityGoals(entity);
//     }
// });

EntityEvents.spawned((event) => {
    let { entity } = event;
    //let tamingItem = tameableMobs[entity.type];
    if (entity.persistentData.OwnerName) {
        reviseTamedPetGoals(entity);
        return;
    }

    if (entity.getRandom().nextInt(100) < 80) return;
    let { STRUCTURE_DATA } = global;
    let { structure, structure_id } = whichStructureAmI(
        entity.blockPosition(),
        event.level
    );
    if (!structure_id) return;
    if (!STRUCTURE_DATA[structure_id]) return;
    if (!STRUCTURE_DATA[structure_id].mobs) return;
    if (!STRUCTURE_DATA[structure_id].mobs.contains(entity.type)) return;

    let nearestPlayer = event.level.getNearestPlayer(entity, 8000);
    if (!nearestPlayer) return;

    if (
        !matchDragonConquerRecord_withBbox(
            nearestPlayer,
            structure.getBoundingBox(),
            structure_id
        )
    )
        return;

    tameCreature(nearestPlayer, entity);
});
/**
 * Tame any mob with felyne_recall
 */
ItemEvents.entityInteracted((event) => {
    let {
        target,
        player,
        player: { mainHandItem },
    } = event;
    if (event.hand != "main_hand") return;
    if (mainHandItem.id != "kubejs:felyne_recall") return;
    //let randomChancetoFail = Math.random();
    if (!target.persistentData.OwnerName) {
        player.level.playSound(
            player,
            target.x,
            target.y,
            target.z,
            Utils.getSound("minecraft:entity.generic.eat"),
            "players",
            0.5,
            0.9
        );
        // if (randomChancetoFail < 0.5) {
        //     target.level.spawnParticles(
        //         "minecraft:campfire_cosy_smoke",
        //         true,
        //         target.x + 0.5,
        //         target.y + 1.05,
        //         target.z + 0.5,
        //         0,
        //         0.3,
        //         0,
        //         2,
        //         0.1
        //     );
        //     mainHandItem.count--;
        //     return;
        // }
        target.level.spawnParticles(
            "minecraft:heart",
            true,
            target.x + 0.5,
            target.y + 1.05,
            target.z + 0.5,
            0,
            0.3,
            0,
            2,
            0.1
        );

        //mainHandItem.count--;
        player.swing("main_hand");

        tameCreature(player, target);
    }

    // if (
    //     target.persistentData.OwnerName &&
    //     target.persistentData.OwnerName == player.getUuid().toString() &&
    //     player.isShiftKeyDown()
    // ) {
    //     let current = target.persistentData.Sitting || 0;
    //     target.persistentData.Sitting = current == 0 ? 1 : 0;
    //     event.cancel();
    // }
});

/**
 *
 * @param {$Mob_} mob
 */
function stopAttacking(mob) {
    if (!(mob instanceof PathfinderMob)) return;
    // mob.targetSelector.getAvailableGoals().forEach((goal) => {
    //     if (!goal.running) return;
    //     goal.stop();
    // });

    mob.setTarget(null);
}

/**
 * Handles all combat logic for tamed pets:
 * 1. Prevents friendly fire between pets and their owner, or pets of the same owner.
 * 2. Records who the owner is attacking.
 * 3. Records who is attacking the owner.
 * This data is used by the pet's AI goal (`tamedCreatureLogic`) to determine targets.
 */
EntityEvents.beforeHurt((event) => {
    let { entity, source } = event;
    let attacker = source.actual;
    if (!attacker) return;
    if (attacker.isPlayer()) {
        //// console.log(attacker);
        if (entity instanceof $TamableAnimal && entity.isOwnedBy(attacker))
            return;
        //// console.log(attacker);
        source.actual.persistentData.lastAttackedMobId = entity
            .getUuid()
            .toString();
        //// console.log(source.actual.persistentData.lastAttackedMobId);
    }
    if (entity.isPlayer()) {
        if (
            attacker.persistentData.OwnerName &&
            attacker.persistentData.OwnerName == entity.getUuid().toString()
        ) {
            // attacker.targetSelector.getAvailableGoals().forEach((goal) => {
            //     if (!goal.running) return;
            //     goal.stop();
            // });
            stopAttacking(attacker);
            event.cancel();
            return;
        }
        if (!(attacker instanceof $TamableAnimal && attacker.isOwnedBy(entity)))
            entity.persistentData.lastMobToAttackMe = attacker
                .getUuid()
                .toString();
    }
});
/**
 * Prevents infighting between tamed mobs by canceling damage events
 * when a mob attempts to hurt its owner or another mob owned by the same player.
 * Also stops attack goals for pathfinding mobs to prevent aggressive behavior.
 */
EntityEvents.beforeHurt((event) => {
    let { entity, source } = event;
    let attacker = source.actual;
    //let tamingItem = tameableMobs[entity.type];
    if (!attacker) return;
    if (entity.persistentData.OwnerName) {
        let ownerUuid = entity.persistentData.OwnerName;
        let attackerUuid = attacker.getUuid().toString();
        let isSameOwner =
            ownerUuid == attackerUuid ||
            attacker.persistentData.OwnerName == ownerUuid;
        let isTamedPet =
            attacker instanceof $TamableAnimal &&
            attacker.owner &&
            attacker.owner.getUuid().toString() == ownerUuid;
        if (isSameOwner || isTamedPet) {
            stopAttacking(attacker);
            event.cancel();
        }
    } else if (
        entity instanceof $TamableAnimal &&
        entity.owner &&
        attacker.persistentData.OwnerName == entity.owner.getUuid().toString()
    ) {
        stopAttacking(attacker);
        event.cancel();
    }
});

let $LivingChangeTargetEvent = Java.loadClass(
    "net.neoforged.neoforge.event.entity.living.LivingChangeTargetEvent"
);

NativeEvents.onEvent($LivingChangeTargetEvent, (event) => {
    let { entity } = event;

    if (entity.level.isClientSide()) return;
    //if (!entity.persistentData.OwnerName) return;
    let target = event.getNewAboutToBeSetTarget();

    if (!isPetOf(entity, target)) return;
    if (!isTraitedEntity(target)) return;
    if (getTraitFromEntity(target, "antimemetic") < 1) return;
    event.setCanceled(true);
});

const TOGGLE_PET_FOLLOWING_KEY = "toggleFollowing";

ItemEvents.entityInteracted((event) => {
    let {
        entity,
        target,
        player,
        player: { mainHandItem },
    } = event;
    if (!mainHandItem.isEmpty()) return;
    //let randomChancetoFail = Math.random();
    if (!target.persistentData.OwnerName) return;
    if (!isPetOf(target, player)) return;
    // if (!player.persistentData.contains(TOGGLE_PET_FOLLOWING_KEY)) {
    //     player.persistentData.putBoolean(TOGGLE_PET_FOLLOWING_KEY, false);
    // }
    let val =
        player.persistentData.getBoolean(TOGGLE_PET_FOLLOWING_KEY) ?? false;
    //console.log(player.persistentData.getBoolean(TOGGLE_PET_FOLLOWING_KEY));
    //console.log(val);
    if (val == false) {
        //console.log(val);
        player.statusMessage = Text.white({
            translate: "kubejs.status.minion.toggle_follow.on",
        });

        //entity.persistentData[TOGGLE_PET_FOLLOWING_KEY] = true;
    } else {
        player.statusMessage = Text.white({
            translate: "kubejs.status.minion.toggle_follow.off",
        });
    }
    console.log(111);
    event.server.scheduleInTicks(1, () => {
        console.log(val);
        player.persistentData.putBoolean(TOGGLE_PET_FOLLOWING_KEY, !val);
        // entity.persistentData.put(TOGGLE_PET_FOLLOWING_KEY, !val);
    });
});
