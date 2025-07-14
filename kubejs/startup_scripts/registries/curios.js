const CLOAK_UUID = "7520dd31-0c06-4351-ba72-db73ce882367";

StartupEvents.registry("item", (event) => {
    event
        .create("lilliput_cloak")
        .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .addAttribute(
                    "minecraft:generic.scale",
                    CLOAK_UUID,
                    -0.56,
                    "add_multiplied_base"
                )
                .modifyAttributesTooltip((tooltips, stack) => [])
                .canWalkOnPowderedSnow((slotContext, stack) => true)
        )
        .maxStackSize(1)
        .unstackable()
        .tag("curios:belt");
    event
        .create("brobdingnag_cloak")
        .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .addAttribute(
                    "minecraft:generic.scale",
                    CLOAK_UUID,
                    0.4,
                    "add_multiplied_base"
                )
                .addAttribute(
                    "generic.attack_damage",
                    CLOAK_UUID,
                    0.1,
                    "add_multiplied_base"
                )
                .addAttribute(
                    "generic.movement_speed",
                    CLOAK_UUID,
                    0.2,
                    "add_multiplied_base"
                )
                .addAttribute(
                    "dragonsurvival:dragon_ability_damage",
                    CLOAK_UUID,
                    0.3,
                    "add_multiplied_base"
                )
                .addAttribute(
                    "dragonsurvival:dragon_breath_range",
                    CLOAK_UUID,
                    0.6,
                    "add_multiplied_base"
                )
                .addAttribute(
                    "dragonsurvival:flight_speed",
                    CLOAK_UUID,
                    0.5,
                    "add_multiplied_base"
                )
                .addAttribute(
                    "dragonsurvival:flight_stamina",
                    CLOAK_UUID,
                    0.2,
                    "add_multiplied_base"
                )
                .addAttribute(
                    "dragonsurvival:mana",
                    CLOAK_UUID,
                    0.2,
                    "add_multiplied_base"
                )
                .addAttribute(
                    "dragonsurvival:mana_regeneration",
                    CLOAK_UUID,
                    0.2,
                    "add_multiplied_base"
                )
                .modifyAttributesTooltip((tooltips, stack) => [])
                .makesPiglinsNeutral((slotContext, stack) => true)
                .isEnderMask((slotContext, enderMan, stack) => true)
        )
        .maxStackSize(1)
        .unstackable()
        .tag("curios:belt");

    event
        .create("kubejs:gene_splicer")
        .useAnimation("bow")
        .useDuration((itemStack) => 10)
        .use((level, player, hand) => {
            return true;
        })
        .finishUsing((itemStack, level, entity) => {
            if (level.isClientSide()) return itemStack;
            return global.MISC.geneSplicerUsed(itemStack, level, entity);
        })
        .attachCuriosCapability(
            CuriosJSCapabilityBuilder.create()
                .onEquip((slotContext, oldStack, newStack) => {
                    global.MISC.geneSplicerOnEquip(
                        slotContext,
                        oldStack,
                        newStack
                    );
                })
                .onUnequip((slotContext, oldStack, newStack) => {
                    global.MISC.geneSplicerOnUnequip(
                        slotContext,
                        oldStack,
                        newStack
                    );
                })
                .canEquipFromUse((s, i) => false)
                .modifyAttributesTooltip((tooltips, stack) => [])
        )
        .fireResistant(true)
        .maxStackSize(1)
        .unstackable()
        .tag("curios:gene");
});
