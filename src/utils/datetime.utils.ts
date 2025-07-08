function pad(number: number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

export function datetimeYMDHis(
  date: Date | string | null = null,
  unit: 'days'| 'mins' | null = null,
  offset: number = 0,
  direction: 'before'| 'after' = 'after',
  mod: 'startOfDay'| 'endOfDay' | null = null,
) {
  let newDate = date ? new Date(date) : new Date();

  if (unit && unit === 'days'){
    if(direction && direction === 'before')
      newDate.setDate(newDate.getDate() - offset);
    if(direction && direction === 'after')
      newDate.setDate(newDate.getDate() + offset);
  }
  if (unit && unit === 'mins'){
    if(direction && direction === 'before')
      newDate = new Date(newDate.getTime() - offset * 60000);
    if(direction && direction === 'after')
      newDate = new Date(newDate.getTime() + offset * 60000);
  }

  // if(mod && mod === 'startOfDay')
  //   newDate = new Date(newDate.setUTCHours(0,0,0,0))
  // if(mod && mod === 'endOfDay')
  //   newDate = new Date(newDate.setUTCHours(23,59,59,999))

  if(mod && mod === 'startOfDay')
    newDate = new Date(newDate.setHours(0,0,0,0))
  if(mod && mod === 'endOfDay')
    newDate = new Date(newDate.setHours(23,59,59,999))

  return `${pad(newDate.getFullYear())}-${pad(newDate.getMonth() + 1)}-${pad(newDate.getDate())} ${pad(newDate.getHours())}:${pad(newDate.getMinutes())}:${pad(newDate.getSeconds())}`;
}

export function groupByDay(data: any, dateField: string) {
  return data.reduce((groups: any, item: any) => {
    const date = new Date(item[dateField]);
    const dayKey = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(item);
    return groups;
  }, {});
}

export function groupByDayCount(data: any, dateField: string) {
  return data.reduce((groups: any, item: any) => {
    const date = new Date(item[dateField]);
    const dayKey = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    if (!groups[dayKey]) {
      groups[dayKey] = 0;
    }

    groups[dayKey]++;

    return groups;
  }, {});
}