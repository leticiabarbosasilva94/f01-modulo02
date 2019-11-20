const { startOfDay, endOfDay, subHours, addHours } = require('date-fns');

const date = new Date().getTime();

console.log(startOfDay(date), endOfDay(date));
console.log(subHours(date, 3));
console.log(addHours(date, 3));
