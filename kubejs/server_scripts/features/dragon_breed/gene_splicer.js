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

global.MISC.geneSplicerOnEquip = geneSplicerOnEquip;
global.MISC.geneSplicerOnUnequip = geneSplicerOnUnequip;
