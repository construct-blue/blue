import {Trip} from "./Trip";

export const testTrip =  {
    "type": "trip",
    "id": "1|486265|0|80|2072023",
    "date": "2023-07-02",
    "line": {
        "type": "line",
        "id": "554",
        "name": "RJ 554",
        "category": "RJ",
        "number": "554",
        "mode": "train",
        "product": {
            "type": "product",
            "id": "nationalExpress",
            "mode": "train",
            "bitmasks": [
                1
            ],
            "name": "InterCityExpress",
            "short": "ICE",
            "default": true
        },
        "operator": {
            "type": "operator",
            "id": "oebb",
            "name": "\u00d6sterreichische Bundesbahnen",
            "displayName": "\u00d6BB",
            "admin": null
        },
        "admin": "81"
    },
    "stopovers": [
        {
            "type": "stopover",
            "stop": {
                "type": "stop",
                "id": "8100173",
                "name": "Graz Hbf",
                "location": {
                    "type": "location",
                    "latitude": 47.072301,
                    "longitude": 15.416437,
                    "altitude": null
                }
            },
            "index": 0,
            "plannedArrival": null,
            "arrival": null,
            "arrivalPlatform": null,
            "plannedDeparture": "2023-07-02T07:25:00+02:00",
            "departure": "2023-07-02T07:25:00+02:00",
            "departurePlatform": "5",
            "isCancelled": false,
            "delay": null,
            "arrivalDelay": null,
            "departureDelay": null,
            "reported": false,
            "border": null,
            "remarks": []
        },
        {
            "type": "stopover",
            "stop": {
                "type": "stop",
                "id": "8100032",
                "name": "Bruck/Mur",
                "location": {
                    "type": "location",
                    "latitude": 47.413828,
                    "longitude": 15.279433,
                    "altitude": null
                }
            },
            "index": 1,
            "plannedArrival": "2023-07-02T08:00:00+02:00",
            "arrival": "2023-07-02T08:00:00+02:00",
            "arrivalPlatform": "2",
            "plannedDeparture": "2023-07-02T08:02:00+02:00",
            "departure": "2023-07-02T08:02:00+02:00",
            "departurePlatform": "2",
            "isCancelled": false,
            "delay": null,
            "arrivalDelay": null,
            "departureDelay": null,
            "reported": false,
            "border": null,
            "remarks": []
        },
        {
            "type": "stopover",
            "stop": {
                "type": "stop",
                "id": "8100031",
                "name": "Kapfenberg",
                "location": {
                    "type": "location",
                    "latitude": 47.44512,
                    "longitude": 15.292089,
                    "altitude": null
                }
            },
            "index": 2,
            "plannedArrival": "2023-07-02T08:07:00+02:00",
            "arrival": "2023-07-02T08:07:00+02:00",
            "arrivalPlatform": "1",
            "plannedDeparture": "2023-07-02T08:08:00+02:00",
            "departure": "2023-07-02T08:08:00+02:00",
            "departurePlatform": "1",
            "isCancelled": false,
            "delay": null,
            "arrivalDelay": null,
            "departureDelay": null,
            "reported": false,
            "border": null,
            "remarks": []
        },
        {
            "type": "stopover",
            "stop": {
                "type": "stop",
                "id": "8100029",
                "name": "M\u00fcrzzuschlag",
                "location": {
                    "type": "location",
                    "latitude": 47.60795,
                    "longitude": 15.677394,
                    "altitude": null
                }
            },
            "index": 3,
            "plannedArrival": "2023-07-02T08:30:00+02:00",
            "arrival": "2023-07-02T08:30:00+02:00",
            "arrivalPlatform": "1",
            "plannedDeparture": "2023-07-02T08:32:00+02:00",
            "departure": "2023-07-02T08:32:00+02:00",
            "departurePlatform": "1",
            "isCancelled": false,
            "delay": null,
            "arrivalDelay": null,
            "departureDelay": null,
            "reported": false,
            "border": null,
            "remarks": []
        },
        {
            "type": "stopover",
            "stop": {
                "type": "stop",
                "id": "8100028",
                "name": "Semmering",
                "location": {
                    "type": "location",
                    "latitude": 47.639548,
                    "longitude": 15.830921,
                    "altitude": null
                }
            },
            "index": 4,
            "plannedArrival": "2023-07-02T08:44:00+02:00",
            "arrival": "2023-07-02T08:44:00+02:00",
            "arrivalPlatform": "1",
            "plannedDeparture": "2023-07-02T08:46:00+02:00",
            "departure": "2023-07-02T08:46:00+02:00",
            "departurePlatform": "1",
            "isCancelled": false,
            "delay": null,
            "arrivalDelay": null,
            "departureDelay": null,
            "reported": false,
            "border": null,
            "remarks": []
        },
        {
            "type": "stopover",
            "stop": {
                "type": "stop",
                "id": "8100516",
                "name": "Wiener Neustadt Hbf",
                "location": {
                    "type": "location",
                    "latitude": 47.810558,
                    "longitude": 16.233188,
                    "altitude": null
                }
            },
            "index": 5,
            "plannedArrival": "2023-07-02T09:28:00+02:00",
            "arrival": "2023-07-02T09:28:00+02:00",
            "arrivalPlatform": "3",
            "plannedDeparture": "2023-07-02T09:32:00+02:00",
            "departure": "2023-07-02T09:32:00+02:00",
            "departurePlatform": "3",
            "isCancelled": false,
            "delay": null,
            "arrivalDelay": null,
            "departureDelay": null,
            "reported": false,
            "border": null,
            "remarks": []
        },
        {
            "type": "stopover",
            "stop": {
                "type": "stop",
                "id": "8100514",
                "name": "Wien Meidling",
                "location": {
                    "type": "location",
                    "latitude": 48.174451,
                    "longitude": 16.333085,
                    "altitude": null
                }
            },
            "index": 6,
            "plannedArrival": "2023-07-02T09:55:00+02:00",
            "arrival": "2023-07-02T09:55:00+02:00",
            "arrivalPlatform": "6",
            "plannedDeparture": "2023-07-02T09:57:00+02:00",
            "departure": "2023-07-02T09:57:00+02:00",
            "departurePlatform": "6",
            "isCancelled": false,
            "delay": null,
            "arrivalDelay": null,
            "departureDelay": null,
            "reported": false,
            "border": null,
            "remarks": []
        },
        {
            "type": "stopover",
            "stop": {
                "type": "stop",
                "id": "8103000",
                "name": "Wien Hbf",
                "location": {
                    "type": "location",
                    "latitude": 48.185103,
                    "longitude": 16.377114,
                    "altitude": null
                }
            },
            "index": 7,
            "plannedArrival": "2023-07-02T10:02:00+02:00",
            "arrival": "2023-07-02T10:02:00+02:00",
            "arrivalPlatform": "9A-B",
            "plannedDeparture": "2023-07-02T10:12:00+02:00",
            "departure": "2023-07-02T10:12:00+02:00",
            "departurePlatform": "9A-B",
            "isCancelled": false,
            "delay": null,
            "arrivalDelay": null,
            "departureDelay": null,
            "reported": false,
            "border": null,
            "remarks": []
        },
        {
            "type": "stopover",
            "stop": {
                "type": "stop",
                "id": "8100353",
                "name": "Flughafen Wien",
                "location": {
                    "type": "location",
                    "latitude": 48.120902,
                    "longitude": 16.563074,
                    "altitude": null
                }
            },
            "index": 8,
            "plannedArrival": "2023-07-02T10:27:00+02:00",
            "arrival": "2023-07-02T10:27:00+02:00",
            "arrivalPlatform": "2",
            "plannedDeparture": null,
            "departure": null,
            "departurePlatform": null,
            "isCancelled": false,
            "delay": null,
            "arrivalDelay": null,
            "departureDelay": null,
            "reported": false,
            "border": null,
            "remarks": []
        }
    ],
    "remarks": [
        {
            "type": "A",
            "code": "FR",
            "prio": 260,
            "message": "Fahrradmitnahme reservierungspflichtig"
        },
        {
            "type": "A",
            "code": "FB",
            "prio": 260,
            "message": "Fahrradmitnahme begrenzt m\u00f6glich"
        },
        {
            "type": "A",
            "code": "UA",
            "prio": 400,
            "message": "Businessabteil"
        },
        {
            "type": "A",
            "code": "BR",
            "prio": 450,
            "message": "Bordrestaurant"
        },
        {
            "type": "A",
            "code": "RO",
            "prio": 560,
            "message": "Rollstuhlstellplatz"
        },
        {
            "type": "A",
            "code": "OA",
            "prio": 560,
            "message": "Rollstuhlstellplatz - Voranmeldung unter +43 5 1717"
        },
        {
            "type": "A",
            "code": "EF",
            "prio": 560,
            "message": "Fahrzeuggebundene Einstiegshilfe"
        },
        {
            "type": "A",
            "code": "OC",
            "prio": 560,
            "message": "rollstuhltaugliches WC"
        },
        {
            "type": "A",
            "code": "HD",
            "prio": 605,
            "message": "Ruhezone"
        },
        {
            "type": "A",
            "code": "KN",
            "prio": 610,
            "message": "Familienzone"
        },
        {
            "type": "A",
            "code": "WV",
            "prio": 710,
            "message": "WLAN verf\u00fcgbar"
        }
    ]
}