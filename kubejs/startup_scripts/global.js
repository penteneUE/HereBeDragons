//priority: 10
let $DragonStateHandler = Java.loadClass(
    "by.dragonsurvivalteam.dragonsurvival.common.capability.DragonStateHandler"
);
let $DragonStateProvider = Java.loadClass(
    "by.dragonsurvivalteam.dragonsurvival.common.capability.DragonStateProvider"
);

global.DRAGON_MAGIC = {
    // crafting: (player) => {
    //     return false;
    // },
    /**
     *
     * @param {integer} spellLevel
     * @param {$LivingEntity_} caster
     * @returns {captureHealth: number, failure: number, growth: number}
     */
    anantaRemanta_info: (spellLevel, caster) => {
        let growth = -1;
        if (caster) {
            if (caster.isPlayer()) {
                growth = global.UTILS.dragonGrowth(caster);
            }
        }

        let minHealth = 1;
        let maxHealth = 20;

        let captureHealth =
            growth == -1
                ? minHealth
                : ((maxHealth - 12) / 10) * spellLevel + growth / 10;

        if (captureHealth < minHealth) captureHealth = minHealth;

        let minFail = 0;
        let maxFail = 50;

        let failureRate =
            growth == -1
                ? maxFail
                : ((maxFail + 12) * (10 - spellLevel)) / 10 - growth / 10;
        if (failureRate < minFail) failureRate = minFail;
        // Caster refers to the player
        return {
            captureHealth: captureHealth,
            failureRate: failureRate,
            growth: growth,
        };
    },
};

global.UTILS = {
    // dragonGrowth: (player) => {
    //     return -1;
    // },
    // weightedRandom: () => {
    //     return {};
    // },
    // whichStructureAmI: (blockPosition, level) => {
    //     return { structure: {}, structure_id: "" };
    // },
    /**
     *
     * @param {$Player_} player
     */
    isDragon: (player) => {
        let handler = $DragonStateProvider.getData(player);

        return handler.isDragon();
    },
    /**
     *
     * @param {$Player_} player
     */
    dragonGrowth: (player) => {
        let handler = $DragonStateProvider.getData(player);

        if (!handler.isDragon()) return -1;

        return handler.getGrowth();
    },
};

global.MISC = {
    // dimensionChanged: (event) => {},
    // spongeUsed: (itemStack, level, entity) => {
    //     return itemStack;
    // },
    // reproductionFrenzyTick: (entity, lvl) => {},
};
Platform.mods.kubejs.name = "Here Were Dragons";
