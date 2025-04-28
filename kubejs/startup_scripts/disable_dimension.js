let $EntityTravelToDimensionEvent = Java.loadClass(
    "net.neoforged.neoforge.event.entity.EntityTravelToDimensionEvent"
);

NativeEvents.onEvent($EntityTravelToDimensionEvent, (event) => {
    global.MISC.dimensionChanged(event);
});
