let $GateEvent$Failed = Java.loadClass(
    "dev.shadowsoffire.gateways.event.GateEvent$Failed"
);
let $GateEvent$Completed = Java.loadClass(
    "dev.shadowsoffire.gateways.event.GateEvent$Completed"
);
let $EntityTravelToDimensionEvent = Java.loadClass(
    "net.neoforged.neoforge.event.entity.EntityTravelToDimensionEvent"
);

NativeEvents.onEvent($EntityTravelToDimensionEvent, (event) => {
    global.MISC.dimensionChanged(event);
});

NativeEvents.onEvent($GateEvent$Completed, (event) => {
    global.MISC.gateCompleted(event);
});

NativeEvents.onEvent($GateEvent$Failed, (event) => {
    global.MISC.gateFailed(event);
});
