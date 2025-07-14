/**
 * @type {$CapabilityCurios$EquipConsumer_}
 */
function geneSplicerOnEquip(slotContext, oldStack, newStack) {
    slotContext.entity().tell("111");
    console.log(slotContext);
}

/**
 * @type {$CapabilityCurios$EquipConsumer_}
 */
function geneSplicerOnUnequip(slotContext, oldStack, newStack) {}

global.MISC.geneSplicerOnEquip = geneSplicerOnEquip;
global.MISC.geneSplicerOnUnequip = geneSplicerOnUnequip;
