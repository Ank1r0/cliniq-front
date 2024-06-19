const currentDate = new Date(Date.now());
const day = currentDate.getDate();
const month = currentDate.getMonth();
const year = currentDate.getFullYear();
const newDate = new Date(year, month, day, 0, 0, 0, 0);

export const dataMlsc = newDate.getTime().toString();

console.log(`
day: ${day},
month: ${month},
year: ${year},
`);

console.log('newDate', newDate);

export const times = [
    { [newDate.getTime().toString()]: '8.00-8.30' },
    { [newDate.getTime().toString()]: '8.30-9.00' },
    // { [new Date(Date.now()).getTime().toString()]: '9.00-9.30' },
    // { [new Date(Date.now()).getTime().toString()]: '9.30-10.00' },
    // { [new Date(Date.now()).getTime().toString()]: '10.00-10.30' },
    // { [new Date(Date.now()).getTime().toString()]: '10.30-11.00' },
    // { [new Date(Date.now()).getTime().toString()]: '11.00-11.30' },
];

export const dateStr = (dataMlsc) => {
    const date = new Date(dataMlsc);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `
        ${day}.${month + 1}.${year}
    `;
};
