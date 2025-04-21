ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event;
    event.register(
        Commands.literal('whredragonswent')
            .requires(src => src.hasPermission(2))
            .then(Commands.literal('keepexp')
                .then(Commands.argument('player', Arguments.PLAYER.create(event))
                    .then(Commands.argument('enabled', Arguments.BOOLEAN.create(event))
                        .executes(ctx => {
                            let keepOrFalse = Arguments.BOOLEAN.getResult(ctx, 'enabled');
                            let player = ctx.source.server.getPlayer(Arguments.PLAYER.getResult(ctx, 'player'))

                            let oriDiffStage = player.stages.getAll().toArray().find(ele => ele.startsWith('keepexp_'))
                            if (oriDiffStage) {
                                player.stages.remove(oriDiffStage)
                            }
                            player.stages.add('keepexp_' + keepOrFalse)
                            return 1
                        })
                    )
                )
            )
            
    )
})