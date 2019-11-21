const date = new Date();

const setHours = (theDate, hour) => {
  theDate.setHours(hour);
  theDate.setMinutes(0);
  theDate.setSeconds(0);
  theDate.setMilliseconds(0);
  return theDate;
};

const startDate = new Date(date.getTime());
setHours(startDate, 8);

const endDate = new Date(date.getTime());
setHours(endDate, 19);

const arr = Array.from(new Array(24).keys());

const dates = arr
  .map(el => {
    const nDate = new Date(date);
    nDate.setHours(el);
    nDate.setMinutes(0);
    nDate.setSeconds(0);
    nDate.setMilliseconds(0);

    return nDate;
  })
  .filter(el => {
    return el >= startDate && el <= endDate;
  });

console.log(dates);
