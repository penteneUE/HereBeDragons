const endlessChallengeMap = Utils.newMap();
endlessChallengeMap.put(
    "kubejs:endless_undead_flag",
    "kubejs:endless/undead_challenge"
);
endlessChallengeMap.put(
    "kubejs:endless_myth_flag",
    "kubejs:endless/myth_challenge"
);
endlessChallengeMap.put(
    "kubejs:endless_titan_flag",
    "kubejs:endless/titan_challenge"
);
endlessChallengeMap.put(
    "kubejs:endless_dragon_flag",
    "kubejs:endless/dragon_challenge"
);

function blockPlaced_endlessChallenge(event) {
    let { player } = event;

    if (!player) return;

    if (!event.block.hasTag("minecraft:banners")) return;

    let { block } = placedAgainstMap[player.uuid];
    //if (!(block instanceof $BlockContainerJS)) return;
    if (!endlessChallengeMap[block.id]) return;

    if (player.stages.has("endless_challenger")) {
        player.tell(
            Text.translate("kubejs.challenge.has_current_challenge").color(
                textColor
            )
        );
        return;
    }

    let targetGateway = endlessChallengeMap[block.id];
    console.log(targetGateway);

    event.server.runCommandSilent(
        `/open_gateway ${block.getX()} ${block.getY()} ${block.getZ()} ${targetGateway}`
    );
    player.stages.add("endless_challenger");
    block.set("kubejs:dragon_flag");
}
