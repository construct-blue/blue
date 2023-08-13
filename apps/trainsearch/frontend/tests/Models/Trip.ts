import {Trip} from "../../src/Models/Trip";

export const trip4711: Trip = {
    id: '123',
    line: {
        id: '4711',
        name: 'S 3',
        number: '3',
        category: 'S',
        admin: '81',
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