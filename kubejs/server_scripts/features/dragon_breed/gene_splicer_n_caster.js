/**
 * @type {$CapabilityCurios$EquipConsumer_}
 */
function geneSplicerOnEquip(slotContext, oldStack, newStack) {
    let breedData = getBreedDataFromItem(newStack);
    if (!breedData || breedData.empty) return;

    slotContext.entity().persistentData.put(BREED_DATA_KEY, breedData);
    updateBreedAttributes(slotContext.entity(), breedData);
}

/**
 * @type {$CapabilityCurios$EquipConsumer_}
 */
function geneSplicerOnUnequip(slotContext, oldStack, newStack) {
    slotContext.entity().persistentData.remove(BREED_DATA_KEY);
    // slotContext.entity().tell("111");
    //updateBreedAttributes(slotContext.entity(), null);
    removeBreedAttributes(slotContext.entity());
}

const CASTER_DATA_KEY = "geneCaster";

/**
 * @type {$CapabilityCurios$EquipConsumer_}
 */
function geneCasterOnEquip(slotContext, oldStack, newStack) {
    slotContext.entity().persistentData.putBoolean(CASTER_DATA_KEY, true);
    geneSplicerOnEquip(slotContext, oldStack, newStack);
}

/**
 * @type {$CapabilityCurios$EquipConsumer_}
 */
function geneCasterOnUnequip(slotContext, oldStack, newStack) {
    slotContext.entity().persistentData.remove(CASTER_DATA_KEY);
    geneSplicerOnUnequip(slotContext, oldStack, newStack);
}

global.MISC.geneSplicerOnEquip = geneSplicerOnEquip;
global.MISC.geneSplicerOnUnequip = geneSplicerOnUnequip;

global.MISC.geneCasterOnEquip = geneCasterOnEquip;
global.MISC.geneCasterOnUnequip = geneCasterOnUnequip;
