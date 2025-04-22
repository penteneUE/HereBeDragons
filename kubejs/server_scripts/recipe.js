ServerEvents.recipes(event => {
    event.remove({ output: 'gateways:gate_pearl' })

    event.shapeless(
        Item.of('kubejs:dragon_flag', 8), // arg 1: output
        [
            '#minecraft:logs',
            'dragonsurvival:elder_dragon_dust',
        ]
    )
})