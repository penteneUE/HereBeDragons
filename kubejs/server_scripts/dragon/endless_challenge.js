const endlessChallengeMap = Utils.newMap();
endlessChallengeMap.put("kubejs:endless_undead_flag", {
    gateway: "kubejs:endless/undead_challenge",
    quest: "quest/endless_undead_completed",
});
endlessChallengeMap.put("kubejs:endless_myth_flag", {
    gateway: "kubejs:endless/myth_challenge",
    quest: "quest/endless_myth_completed",
});
endlessChallengeMap.put("kubejs:endless_titan_flag", {
    gateway: "kubejs:endless/titan_challenge",
    quest: "quest/endless_titan_completed",
});
endlessChallengeMap.put("kubejs:endless_dragon_flag", {
    gateway: "kubejs:endless/dragon_challenge",
    quest: "quest/endless_dragon_completed",
});

/**
 *
 * @param {$BlockPlacedKubeEvent_} event
 * @returns
 */
function blockPlaced_endlessChallenge(event) {
    let { player } = event;

    if (!player) return;

    if (!event.block.hasTag("minecraft:banners")) return;

    let { block } = placedAgainstMap[player.uuid];
    //if (!(block instanceof $BlockContainerJS)) return;
    if (!endlessChallengeMap[block.id]) return;

    let endless = player.persistentData.getString("endlessChallengeId");
    if (endless) {
        player.tell(
            Text.translate("kubejs.challenge.has_current_challenge").color(
                textColor
            )
        );
        return;
    }

    let targetGateway = endlessChallengeMap[block.id].gateway;

    let result = summonGateway(
        player,
        block.getPos(),
        targetGateway,
        event.level
    );
    if (result == -1) {
        player.tell(Text.translate("kubejs.conquest.error").color(textColor));
        return;
    }

    // event.server.runCommandSilent(
    //     `/open_gateway ${player.username.toString()} ${targetGateway}`
    // );
    //player.stages.add("endless_challenger");
    player.persistentData.putString("endlessChallengeId", block.id);

    block.set("kubejs:dragon_flag");
}
