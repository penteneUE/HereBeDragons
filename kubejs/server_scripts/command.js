ServerEvents.commandRegistry((event) => {
    const { commands: Commands, arguments: Arguments } = event;
    event.register(
        Commands.literal("whredragonswent")
            .requires((src) => src.hasPermission(2))
            .then(
                Commands.literal("keepexp").then(
                    Commands.argument(
                        "player",
                        Arguments.PLAYER.create(event)
                    ).then(
                        Commands.argument(
                            "enabled",
                            Arguments.BOOLEAN.create(event)
                        ).executes((ctx) => {
                            let keepOrFalse = Arguments.BOOLEAN.getResult(
                                ctx,
                                "enabled"
                            );
                            let player = ctx.source.server.getPlayer(
                                Arguments.PLAYER.getResult(ctx, "player")
                            );
                            if (keepOrFalse) {
                                player.stages.add("keepexp");
                            } else {
                                player.stages.remove("keepexp");
                            }
                            return 1;
                        })
                    )
                )
            )
            .then(
                Commands.literal("onlydragon").then(
                    Commands.argument(
                        "player",
                        Arguments.PLAYER.create(event)
                    ).then(
                        Commands.argument(
                            "enabled",
                            Arguments.BOOLEAN.create(event)
                        ).executes((ctx) => {
                            let keepOrFalse = Arguments.BOOLEAN.getResult(
                                ctx,
                                "enabled"
                            );
                            let player = ctx.source.server.getPlayer(
                                Arguments.PLAYER.getResult(ctx, "player")
                            );
                            if (keepOrFalse) {
                                player.stages.add("disablehuman");
                            } else {
                                player.stages.remove("disablehuman");
                            }
                            return 1;
                        })
                    )
                )
            )
            .then(
                Commands.literal("clear-world-ender").then(
                    Commands.argument(
                        "player",
                        Arguments.PLAYER.create(event)
                    ).executes((ctx) => {
                        let player = ctx.source.server.getPlayer(
                            Arguments.PLAYER.getResult(ctx, "player")
                        );
                        clearWorldEnder(player);
                        return 1;
                    })
                )
            )
            .then(
                Commands.literal("clear-challenger").then(
                    Commands.argument(
                        "player",
                        Arguments.PLAYER.create(event)
                    ).executes((ctx) => {
                        let player = ctx.source.server.getPlayer(
                            Arguments.PLAYER.getResult(ctx, "player")
                        );
                        if (player.stages.has("paper_myth_challenger"))
                            player.stages.remove("paper_myth_challenger");
                        if (player.stages.has("endless_challenger"))
                            player.stages.remove("endless_challenger");
                        return 1;
                    })
                )
            )
            .then(
                Commands.literal("conquest")
                    .then(
                        Commands.literal("clear-records").then(
                            Commands.argument(
                                "player",
                                Arguments.PLAYER.create(event)
                            ).executes((ctx) => {
                                //addDragonConquerRecord(player, bbox.minX(), bbox.maxX(), bbox.minY(), bbox.maxY(), bbox.minZ(), bbox.maxZ(), structure_id)
                                let player = ctx.source.server.getPlayer(
                                    Arguments.PLAYER.getResult(ctx, "player")
                                );
                                clearDragonConquerRecord(player);
                                return 1;
                            })
                        )
                    )
                    // .then(
                    //     Commands.literal("clear-current").then(
                    //         Commands.argument(
                    //             "player",
                    //             Arguments.PLAYER.create(event)
                    //         ).executes((ctx) => {
                    //             //addDragonConquerRecord(player, bbox.minX(), bbox.maxX(), bbox.minY(), bbox.maxY(), bbox.minZ(), bbox.maxZ(), structure_id)
                    //             let player = ctx.source.server.getPlayer(
                    //                 Arguments.PLAYER.getResult(ctx, "player")
                    //             );
                    //             clearDragonConquerCurrent(player);
                    //             return 1;
                    //         })
                    //     )
                    // )
                    .then(
                        Commands.literal("clear-structure-type").then(
                            Commands.argument(
                                "player",
                                Arguments.PLAYER.create(event)
                            ).then(
                                Commands.argument(
                                    "structure_id",
                                    Arguments.STRING.create(event)
                                ).executes((ctx) => {
                                    //addDragonConquerRecord(player, bbox.minX(), bbox.maxX(), bbox.minY(), bbox.maxY(), bbox.minZ(), bbox.maxZ(), structure_id)
                                    let player = ctx.source.server.getPlayer(
                                        Arguments.PLAYER.getResult(
                                            ctx,
                                            "player"
                                        )
                                    );
                                    clearDragonConquerStructure(
                                        player,
                                        Arguments.STRING.getResult(
                                            ctx,
                                            "structure_id"
                                        )
                                    );
                                    return 1;
                                })
                            )
                        )
                    )
                    .then(
                        Commands.literal("clear-here").then(
                            Commands.argument(
                                "player",
                                Arguments.PLAYER.create(event)
                            ).executes((ctx) => {
                                //addDragonConquerRecord(player, bbox.minX(), bbox.maxX(), bbox.minY(), bbox.maxY(), bbox.minZ(), bbox.maxZ(), structure_id)
                                let player = ctx.source.server.getPlayer(
                                    Arguments.PLAYER.getResult(ctx, "player")
                                );
                                clearDragonConquerHere(player);
                                return 1;
                            })
                        )
                    )
                    .then(
                        Commands.literal("view").then(
                            Commands.argument(
                                "player",
                                Arguments.PLAYER.create(event)
                            ).executes((ctx) => {
                                //addDragonConquerRecord(player, bbox.minX(), bbox.maxX(), bbox.minY(), bbox.maxY(), bbox.minZ(), bbox.maxZ(), structure_id)
                                //console.log(111)
                                let player = ctx.source.server.getPlayer(
                                    Arguments.PLAYER.getResult(ctx, "player")
                                );
                                if (ctx.source.isPlayer()) {
                                    ctx.source
                                        .getPlayer()
                                        .tell(player.persistentData);
                                    // ctx.source.getPlayer().tell(player.persistentData.dragonConquerRecords)
                                    // ctx.source.getPlayer().tell(player.persistentData.dragonConquerCurrent)
                                    // ctx.source.getPlayer().tell(player.persistentData.dragonConquerCurrentId)
                                } else {
                                    console.log(player.persistentData);
                                    // console.log(player.persistentData.dragonConquerRecords)
                                    // console.log(player.persistentData.dragonConquerCurrent)
                                    // console.log(player.persistentData.dragonConquerCurrentId)
                                }

                                return 1;
                            })
                        )
                    )
                    .then(
                        Commands.literal("finish").then(
                            Commands.argument(
                                "player",
                                Arguments.PLAYER.create(event)
                            ).executes((ctx) => {
                                //addDragonConquerRecord(player, bbox.minX(), bbox.maxX(), bbox.minY(), bbox.maxY(), bbox.minZ(), bbox.maxZ(), structure_id)
                                //console.log(111)
                                let player = ctx.source.server.getPlayer(
                                    Arguments.PLAYER.getResult(ctx, "player")
                                );

                                //const structure_id = player.persistentData.getString("dragonConquerCurrentId")
                                finishDragonConquest(player);

                                // if (
                                //     player.stages.has(
                                //         "dragon_conquest_challenger"
                                //     )
                                // ) {
                                //     player.stages.remove(
                                //         "dragon_conquest_challenger"
                                //     );
                                // }

                                //ctx.source.server.runCommand(`/effect clear ${player.name.toString()} dragonsurvival:hunter_omen`)

                                ctx.source.server.runCommandSilent(
                                    `/playsound minecraft:entity.player.levelup player ${player.username.toString()} ${
                                        player.x
                                    } ${player.y} ${player.z}`
                                );
                                ctx.source.server.runCommandSilent(
                                    `/playsound minecraft:entity.firework_rocket.launch player ${player.username.toString()} ${
                                        player.x
                                    } ${player.y} ${player.z}`
                                );
                                return 1;
                            })
                        )
                    )
                    .then(
                        Commands.literal("failure").then(
                            Commands.argument(
                                "player",
                                Arguments.PLAYER.create(event)
                            ).executes((ctx) => {
                                //addDragonConquerRecord(player, bbox.minX(), bbox.maxX(), bbox.minY(), bbox.maxY(), bbox.minZ(), bbox.maxZ(), structure_id)
                                //console.log(111)
                                let player = ctx.source.server.getPlayer(
                                    Arguments.PLAYER.getResult(ctx, "player")
                                );

                                clearDragonConquerCurrent(player);

                                // if (
                                //     player.stages.has(
                                //         "dragon_conquest_challenger"
                                //     )
                                // ) {
                                //     player.stages.remove(
                                //         "dragon_conquest_challenger"
                                //     );
                                // }
                                return 1;
                            })
                        )
                    )
            )
            .then(
                Commands.literal("trigger-day-pass").then(
                    Commands.argument(
                        "player",
                        Arguments.PLAYER.create(event)
                    ).executes((ctx) => {
                        //addDragonConquerRecord(player, bbox.minX(), bbox.maxX(), bbox.minY(), bbox.maxY(), bbox.minZ(), bbox.maxZ(), structure_id)
                        //console.log(111)
                        let player = ctx.source.server.getPlayer(
                            Arguments.PLAYER.getResult(ctx, "player")
                        );

                        player.persistentData.putInt("lastDay", -1);
                        return 1;
                    })
                )
            )
            .then(
                Commands.literal("breed").then(
                    Commands.literal("random-egg").then(
                        Commands.argument(
                            "player",
                            Arguments.PLAYER.create(event)
                        ).executes((ctx) => {
                            let player = ctx.source.server.getPlayer(
                                Arguments.PLAYER.getResult(ctx, "player")
                            );
                            giveRandomEgg(player);
                            //player.persistentData.putInt("lastDay", -1);
                            return 1;
                        })
                    )
                )
            )
    );
});

/**
 *
 * @param {$ServerPlayer_} player
 */
function giveRandomEgg(player) {
    let egg = Item.of("iceandfire:dragonegg_black");
    egg.setCustomData(randomBreedData(player.random));
    //player.give(egg);
    player.block.popItem(egg);
}

// ItemEvents.rightClicked("stick", (event) => {
//     let { player } = event;
//     giveRandomEgg(event.player);
//     player.tell("111");
//     let egg = Item.of("iceandfire:dragonegg_black");
//     player.tell("111");
//     console.log(randomBreedData(player.random));
//     egg.setCustomData(randomBreedData(player.random));
//     player.tell("111");
//     //player.give(egg);
//     player.block.popItem(egg);
//     player.tell("111");
// });
