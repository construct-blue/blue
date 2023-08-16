import {Stopover} from "../../src/Models/Stopover";
import {stopBruckMur, stopGrazHbf, stopKapfenberg, stopMuerzzuschlag, stopSemmering} from "./Stop";
import {lineVindobona} from "./Line";

export const stopoverBruckMur: Stopover = {
    stop: stopBruckMur,
    plannedArrival: "2023-08-15T18:57:00+02:00",
    arrival: "2023-08-15T18:57:00+02:00",
    plannedDeparture: "2023-08-15T18:59:00+02:00",
    departure: "2023-08-15T18:59:00+02:00",
    departurePlatform: null,
    "arrivalPlatform": null,
    requestStop: null,
    isCancelled: false,
    arrivalDelay: null,
    departureDelay: null,
    reported: false,
    border: null,
    remarks: [],
    infos: [],
    line: lineVindobona,
    changedLine: false
}

export const stopoverKapfenberg: Stopover =  {
    stop: stopKapfenberg,
    plannedArrival: "2023-08-15T18:51:00+02:00",
    arrival: "2023-08-15T18:51:00+02:00",
    plannedDeparture: "2023-08-15T18:52:00+02:00",
    departure: "2023-08-15T18:52:00+02:00",
    departurePlatform: null,
    "arrivalPlatform": null,
    requestStop: null,
    isCancelled: false,
    arrivalDelay: null,
    departureDelay: null,
    reported: false,
    border: null,
    remarks: [],
    infos: [],
    line: lineVindobona,
    changedLine: false
}

export const stopoverSemmering: Stopover =  {
    stop: stopSemmering,
    "plannedArrival": "2023-08-16T09:15:00+02:00",
    "arrival": "2023-08-16T09:16:00+02:00",
    "plannedDeparture": "2023-08-16T09:16:00+02:00",
    "departure": "2023-08-16T09:16:00+02:00",
    "arrivalPlatform": null,
    "departurePlatform": "1",
    "requestStop": null,
    "isCancelled": false,
    "arrivalDelay": 60,
    "departureDelay": null,
    "reported": true,
    "border": null,
    "remarks": [],
    "infos": [],
    "line": lineVindobona,
    changedLine: true
}

export const stopoverMuerzzulschlag: Stopover =  {
    "stop": stopMuerzzuschlag,
    "plannedArrival": "2023-08-16T09:28:00+02:00",
    "arrival": "2023-08-16T09:28:00+02:00",
    "plannedDeparture": "2023-08-16T09:30:00+02:00",
    "departure": "2023-08-16T09:31:00+02:00",
    "arrivalPlatform": null,
    "departurePlatform": "4",
    "requestStop": null,
    "isCancelled": false,
    "arrivalDelay": null,
    "departureDelay": 60,
    "reported": true,
    "border": null,
    "remarks": [],
    "infos": [],
    "line": lineVindobona,
    "changedLine": true
}

export const stopoverGrazHbf: Stopover =  {
    "stop": stopGrazHbf,
    "plannedArrival": "2023-08-16T10:34:00+02:00",
    "arrival": "2023-08-16T10:34:00+02:00",
    "plannedDeparture": "2023-08-16T10:39:00+02:00",
    "departure": "2023-08-16T10:39:00+02:00",
    "arrivalPlatform": "4",
    "departurePlatform": "4",
    "requestStop": null,
    "isCancelled": false,
    "arrivalDelay": null,
    "departureDelay": null,
    "reported": false,
    "border": null,
    "remarks": [],
    "infos": [],
    "line": lineVindobona,
    "changedLine": false
}