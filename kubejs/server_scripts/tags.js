ServerEvents.tags("item", (event) => {
    event.add("kubejs:dragon_focus", [
        "dragonsurvival:weak_dragon_heart",
        "dragonsurvival:elder_dragon_heart",
    ]);

    event.add("kubejs:dragon_reproduction_item", [
        "iceandfire:lightning_lily",
        "iceandfire:frost_lily",
        "iceandfire:fire_lily",
        "iceandfire:lightning_stew",
        "iceandfire:frost_stew",
        "iceandfire:fire_stew",
    ]);
});
