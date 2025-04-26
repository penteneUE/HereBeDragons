let $EntityTravelToDimensionEvent = Java.loadClass(
    "net.neoforged.neoforge.event.entity.EntityTravelToDimensionEvent"
);

NativeEvents.onEvent($EntityTravelToDimensionEvent, (event) => {
    global.MISC.dimensionChanged(event);
});
/**
 *
 * @param {$EntityTravelToDimensionEvent_} event
 */
global.MISC.dimensionChanged = (event) => {
    const { entity, dimension } = event;

    try {
        switch (dimension.location().toString()) {
            case "iceandfire:dread_land":
                event.setCanceled(true);

                if (entity.player) {
                    /**
                     * @type {$Player_} - 判断是否为玩家，通过后重申entity的类型
                     */
                    let player = entity;
                    player.tell(
                        Text.translate(
                            "kubejs.dimensiontravel.failed.dread_land"
                        ).gold()
                    );
                }
                break;
            case "minecraft:the_end":
                if (entity.player) {
                    /**
                     * @type {$Player_} - 判断是否为玩家，通过后重申entity的类型
                     */
                    let player = entity;

                    /**
                     * @type {$CompoundTag_} - 判断是否为玩家，通过后重申entity的类型
                     */
                    const { dragonConquerRecords } = player.persistentData;

                    if (
                        dragonConquerRecords &&
                        dragonConquerRecords["minecraft:stronghold"] &&
                        !dragonConquerRecords["minecraft:stronghold"].isEmpty()
                    ) {
                        return;
                    }

                    event.setCanceled(true);

                    player.tell(
                        Text.translate(
                            "kubejs.dimensiontravel.failed.the_end"
                        ).gold()
                    );
                }
        }
    } catch (error) {
        console.log(error);
    }
};
