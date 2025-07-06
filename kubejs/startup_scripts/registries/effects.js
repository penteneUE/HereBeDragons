StartupEvents.registry("mob_effect", (event) => {
    event
        .create("reproduction_frenzy") // Create the effect under "kubejs:custom_effect"
        .color(0xff0035) // Sets the color of the Effect's Particles.
        .beneficial(); // Categorizes the Effect as Beneficial.
    // .effectTick((entity, lvl) => {
    //     // This useful for reoccurring logic while the entity is under the effect.
    //     // Heal the entity once a second scaled by the effect's level, much like regeneration.
    //     if (entity.age % 20 != 0) return;

    //     global.MISC.reproductionFrenzyTick(entity, lvl);
    // });
});
