import {Stopover} from "../../src/Models/Stopover";
import {stopBruckMur, stopKapfenberg} from "./Stop";
import {lineVindobona} from "./Line";

export const stopoverBruckMur: Stopover = {
    stop: stopBruckMur,
    plannedArrival: "2023-08-15T18:57:00+02:00",
    arrival: "2023-08-15T18:57:00+02:00",
    plannedDeparture: "2023-08-15T18:59:00+02:00",
    departure: "2023-08-15T18:59:00+02:00",
    departurePlatform: null,
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