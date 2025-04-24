/**
 * 
 * @param {$SimplePlayerKubeEvent_} event 
 * @returns 
 */
function playerTick_Sponge(event) {
    const { player, player : {inventory} } = event;

    if (!inventory.hasAnyOf("kubejs:dry_sponge")) return

    //if (!player.isInWater()) return;
    if (!player.isUnderWater()) return;

    let slot = inventory.find("kubejs:dry_sponge")
    let count = inventory.getStackInSlot(slot).getCount()
    inventory.setStackInSlot(slot, Item.of("kubejs:wet_sponge").withCount(count))
    
 }