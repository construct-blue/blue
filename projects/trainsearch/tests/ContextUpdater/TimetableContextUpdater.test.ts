import {describe, expect, it} from "@jest/globals";
import {TestClient} from "../Client/TestClient";
import {stopBruckMur, stopKapfenberg, stopSemmering} from "../Models/Stop";
import {trip4711} from "../Models/Trip";
import {TimetableContext} from "../../src/Context/TimetableContext";
import {stopoverBruckMur, stopoverKapfenberg} from "../Models/Stopover";
import {TimetableContextUpdater} from "../../src/ContextUpdater/TimetableContextUpdater";

describe('TimetableContextUpdater', () => {
    it('should update the list of stops with vehicle info', async () => {
        const client = new TestClient({
            departures: [],
            stops: [stopBruckMur, stopKapfenberg, stopSemmering],
            trip: trip4711
        })

        const contextUpdater = new TimetableContextUpdater(client);

        const context = new TimetableContext('oebb', [], [])
        const updatedContext = await contextUpdater.update(context)

        expect(updatedContext.hasVehicleInfo(stopoverBruckMur)).toBe(true)
        expect(updatedContext.hasVehicleInfo(stopoverKapfenberg)).toBe(true)
    })
})