import {Trip} from "../../src/Models/Trip";

export const trip4711: Trip = {
    id: '123',
    line: {
        id: '4711',
        name: 'S 3',
        number: '3',
        category: 'S',
        admin: '81',
        trainName: null,
        operator: {id: 'oebb'},
        product: {id: 'suburban'},
    },
    direction: 'Graz Hbf',
    date: new Date('2023-08-11'),
    stopovers: [],
    infos: [],
    remarks: [],
    foreign: false,
}

export const trip564: Trip = {
    id: 'test-564',
    line: {
        id: '564',
        name: 'IC 564',
        number: '564',
        category: 'IC',
        admin: '55',
        trainName: 'TOKAJ',
        operator: {id: 'mav'},
        product: {id: 'national'},
    },
    direction: 'Budapest-Nyugati',
    date: new Date('2023-08-11'),
    stopovers: [],
    infos: [],
    remarks: [],
    foreign: true,
}