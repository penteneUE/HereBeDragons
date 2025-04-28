/**
 * @type {$Map_<$UUID_, {block: $BlockContainerJS_, facing: $Direction_}>}
 */
const placedAgainstMap = Utils.newMap();

BlockEvents.rightClicked((event) => {
    placedAgainstMap[event.player.uuid] = {
        block: event.block,
        facing: event.facing,
    };
});

BlockEvents.placed((event) => {
    blockPlaced_dragonConquer(event);
    blockPlaced_taxCollect(event);
    blockPlaced_endlessChallenge(event);
});

BlockEvents.broken((event) => {
    blockBroken_TaxCollect(event);
});
