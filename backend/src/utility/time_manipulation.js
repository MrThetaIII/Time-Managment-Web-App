export const getDaysListFromSchedule = (current_date, start_date, end_date, every) => {
    const current_day = new Date(current_date);
    const start_day = new Date(start_date);
    const end_day = new Date(end_date);
    start_day.setHours(0, 0, 0, 0);
    end_day.setHours(0, 0, 0, 0);
    current_day.setHours(0, 0, 0, 0);
    const offset = (current_day.getDay() + 1) % 7;
    const difference = ((current_day.getTime() - start_day.getTime()) / (3600 * 24000)) - offset;
    const lower = Math.ceil(difference / every);
    const upper = Math.floor((difference + 6) / every);
    const values = Array.from(Array(upper - lower + 1).keys())
        .map(a => (lower + a) * every - difference)
        .filter(a => {
            const current = current_day.getTime() + (a - offset) * (3600 * 24000);
            return current >= start_day.getTime() && current <= end_day.getTime()
        })
    return values
}

export const withinTheWeek = (current_date, date) => {
    const current_day = new Date(current_date);
    const day = new Date(date);
    current_day.setHours(0, 0, 0, 0);
    day.setHours(0, 0, 0, 0);
    const offset = (current_day.getDay() + 1) % 7;
    return (day.getTime() - current_day.getTime()) / (3600 * 24000) + offset
}

export const startPoint = (time, starting_hour) => {
    const time_object = new Date(time)
    return (time_object.getHours() - starting_hour) * 60 + time_object.getMinutes()
}

export const current_event_date = (day, current_d) => {
    const current_day = new Date(current_d);
    const offset = (current_day.getDay() + 1) % 7;
    const current = current_day.getTime() + (day - offset) * (3600 * 24000);
    return new Date(current);
}

export const timeFromDate = date => {
    const date_object = new Date(date)
    return `${date_object.getHours().toString().padStart(2, '0')}:${date_object.getMinutes().toString().padStart(2, '0')}:${date_object.getSeconds().toString().padStart(2, '0')}`
}