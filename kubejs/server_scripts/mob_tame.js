let $TamableAnimal = Java.loadClass("net.minecraft.world.entity.TamableAnimal");
let $NearestAttackableTargetGoal = Java.loadClass(
    "net.minecraft.world.entity.ai.goal.target.NearestAttackableTargetGoal"
);

let $DefendVillageTargetGoal = Java.loadClass(
    "net.minecraft.world.entity.ai.goal.target.DefendVillageTargetGoal"
);
let $HurtByTargetGoal = Java.loadClass(
    "net.minecraft.world.entity.ai.goal.target.HurtByTargetGoal"
);
// let SpiderTargetGoal = Java.loadClass(
//     "net.minecraft.world.entity.monster.Spider$SpiderTargetGoal"
// );
let HurtByTargetGoal = Java.loadClass(
    "net.minecraft.world.entity.ai.goal.target.HurtByTargetGoal"
);
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
let CustomGoal = Java.loadClass("net.liopyu.entityjs.util.ai.CustomGoal");
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

function tamedCreatureLogic(mob, t) {
    try {
        if (mob.persistentData.OwnerName) {
            let owner;
            // let owner = mob
            //     .getLevel()
            //     ?.getPlayerByUUID(
            //         UUID.fromString(
            //             mob.persistentData.OwnerName
            //         )
            //     );
            let playerList = mob.getServer().playerList.getPlayers().iterator();
            while (playerList.hasNext()) {
                let player = playerList.next();
                if (
                    player.getUuid().toString() == mob.persistentData.OwnerName
                ) {
                    owner = player;
                }
            }

            //console.log(mob.getServer().getPlayers().filter([(value) => {}]));
            if (owner) {
                let lastAttackedId = owner.persistentData.lastAttackedMobId;
                let lastAttackedMeId = owner.persistentData.lastMobToAttackMe;
                if (lastAttackedId) {
                    let entityRef = mob.level
                        .getEntities()
                        .filter(
                            (e) => e.getUuid().toString() == lastAttackedId
                        )[0];
                    //console.log(entityRef);
                    if (entityRef) {
                        if (
                            entityRef.persistentData.OwnerName ==
                                owner.getUuid().toString() ||
                            (t instanceof $TamableAnimal && t.isOwnedBy(owner))
                        ) {
                            owner.persistentData.remove("lastMobToAttackMe");
                            return false;
                        }
                        if (entityRef.distanceToEntity(mob) <= 60) {
                            return (
                                entityRef.getUuid().toString() ==
                                t.getUuid().toString()
                            );
                        } else {
                            owner.persistentData.remove("lastAttackedMobId");
                        }
                    } else {
                        owner.persistentData.remove("lastAttackedMobId");
                    }
                }
                if (lastAttackedMeId) {
                    let entityRef = mob.level
                        .getEntities()
                        .filter(
                            (e) => e.getUuid().toString() == lastAttackedMeId
                        )[0];
                    //console.log(entityRef);
                    if (entityRef) {
                        if (
                            entityRef.persistentData.OwnerName ==
                                owner.getUuid().toString() ||
                            (t instanceof $TamableAnimal && t.isOwnedBy(owner))
                        ) {
                            owner.persistentData.remove("lastMobToAttackMe");
                            return false;
                        }
                        if (entityRef.distanceToEntity(mob) <= 60) {
                            return (
                                entityRef.getUuid().toString() ==
                                t.getUuid().toString()
                            );
                        } else {
                            owner.persistentData.remove("lastMobToAttackMe");
                        }
                    } else {
                        owner.persistentData.remove("lastMobToAttackMe");
                    }
                }
            }
        }
        let fallback =
            t instanceof Player &&
            mob.persistentData.OwnerName != t.getUuid().toString();
        return fallback;
    } catch (e) {
        console.log(e);
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
    if (mob instanceof PathfinderMob) {
        // simply stop all goals to reset aggro
        mob.targetSelector.getAvailableGoals().forEach((goal) => {
            if (!goal.running) return;
            goal.stop();
        });
        //mob.targetSelector.getRunningGoals().forEach((goal) => goal.stop());
        // here we remove all nearest attackable target goals so it doesnt attack us or other mobs on sight
        // the entity goal to remove will vary depending on the mob tamed, so you may need to add more cases for other mobs
        mob.targetSelector.removeAllGoals(
            (goal) => goal instanceof $NearestAttackableTargetGoal
        );
        if (
            mob.goalSelector.availableGoals.some(
                (goal) => goal.goal instanceof $DefendVillageTargetGoal
            )
        ) {
            mob.targetSelector.removeAllGoals(
                (goal) => goal instanceof $DefendVillageTargetGoal
            );
            mob.server.scheduleInTicks(1, () => {
                mob.targetSelector.addGoal(
                    1,
                    new $DefendVillageTargetGoal(
                        mob,
                        LivingEntity,
                        1,
                        true,
                        false,
                        (t) => {
                            return tamedCreatureLogic(mob, t);
                        }
                    )
                );
            });
            return;
        }
        if (
            mob.goalSelector.availableGoals.some(
                (goal) => goal.goal instanceof $RangedCrossbowAttackGoal
            )
        ) {
            mob.server.scheduleInTicks(1, () => {
                mob.targetSelector.addGoal(
                    1,
                    new $HurtByTargetGoal(
                        mob,
                        LivingEntity,
                        1,
                        true,
                        false,
                        (t) => {
                            return tamedCreatureLogic(mob, t);
                        }
                    )
                );
            });
        }
        if (
            mob.goalSelector.availableGoals.some(
                (goal) => goal.goal instanceof MeleeAttackGoal
            ) ||
            mob.goalSelector.availableGoals.some(
                (goal) => goal.goal instanceof $RangedAttackGoal
            ) ||
            mob.goalSelector.availableGoals.some(
                (goal) => goal.goal instanceof $RangedBowAttackGoal
            )
        ) {
            // re-add the NearestAttackableTargetGoal & HurtByTargetGoal to make it only attack the last entity the player attacked
            mob.server.scheduleInTicks(1, () => {
                mob.targetSelector.addGoal(
                    1,
                    new $NearestAttackableTargetGoal(
                        mob,
                        LivingEntity,
                        1,
                        true,
                        false,
                        (t) => {
                            return tamedCreatureLogic(mob, t);
                        }
                    )
                );
            });
        }
    }
}
EntityEvents.spawned((event) => {
    const { entity } = event;
    //let tamingItem = tameableMobs[entity.type];
    if (entity.persistentData.OwnerName) reviseTamedPetGoals(entity);
    else {
        if (Math.floor(Math.random() * 6) != 0) return;
        const { STRUCTURE_DATA } = global;
        const { structure, structure_id } = whichStructureAmI(
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
    }
});
/**
 * Handles taming, saddling, and sitting for custom tameable mobs.
 *
 * - Right-click with the taming item: 50% chance to tame if unowned.
 * - Right-click with saddle (if owner): equips the mob with a saddle.
 * - Shift-right-click (if owner): toggles sitting state.
 *
 * Consumes items as needed and cancels default interaction behavior where appropriate.
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
 * Tracks combat interactions to support retaliatory targeting by tamed mobs.
 *
 * - Sets `lastAttackedMobId` on the attacking player when they damage a mob,
 *   unless the mob is their own tamed pet.
 *
 * - Sets `lastMobToAttackMe` on the player when they are attacked,
 *   unless the attacker is their own tamed pet.
 *
 * These values can be used in a `NearestAttackableTargetGoal` to let
 * tamed mobs automatically retaliate when their owner is hurt or when
 * the owner attacks something.
 */
EntityEvents.beforeHurt((event) => {
    let { entity, source } = event;
    let attacker = source.actual;
    if (!attacker) return;
    if (attacker.isPlayer()) {
        //console.log(attacker);
        if (entity instanceof $TamableAnimal && entity.isOwnedBy(attacker))
            return;
        //console.log(attacker);
        source.actual.persistentData.lastAttackedMobId = entity
            .getUuid()
            .toString();
        //console.log(source.actual.persistentData.lastAttackedMobId);
    }
    if (entity.isPlayer()) {
        if (
            attacker.persistentData.OwnerName &&
            attacker.persistentData.OwnerName == entity.getUuid().toString()
        ) {
            attacker.targetSelector.getAvailableGoals().forEach((goal) => {
                if (!goal.running) return;
                goal.stop();
            });
            event.cancel();
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
            if (attacker instanceof PathfinderMob) {
                attacker.targetSelector.getAvailableGoals().forEach((goal) => {
                    if (!goal.running) return;
                    goal.stop();
                });
            }
            event.cancel();
        }
        entity.persistentData.Sitting = 0;
    } else if (
        entity instanceof $TamableAnimal &&
        entity.owner &&
        attacker.persistentData.OwnerName == entity.owner.getUuid().toString()
    ) {
        if (attacker instanceof PathfinderMob) {
            attacker.targetSelector.getAvailableGoals().forEach((goal) => {
                if (!goal.running) return;
                goal.stop();
            });
        }
        event.cancel();
    }
});
