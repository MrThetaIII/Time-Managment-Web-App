import config from '../config.json'

export const daysOfTheWeek = (current_date) => {
    const current_day = new Date(current_date);
    current_day.setHours(0, 0, 0, 0);
    const offset = (current_day.getDay() + 1) % 7;
    const days = Array.from(Array(7).keys())
        .map(a => (current_day.getTime()) / (3600 * 24000) - offset + a)
        .map(a => new Date(a * (3600 * 24000)))
        .map(a => `${a.getDate().toString().padStart(2, '0')}/${(a.getMonth() + 1).toString().padStart(2, '0')}/${a.getFullYear()}`)
    return days
}

export const date_time_stringify = (date) => (
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
)

export const date_stringify = (date) => (
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
)

export const near = (start_time, duration) => {
    const now = (new Date()).getTime();
    const eventTime = (new Date(start_time)).getTime();
    return now >= eventTime - duration * 60000;
}

export const isBeforeByDuration = (date_before, date_after, duration) => {
    const before = (new Date(date_before)).getTime();
    const after = (new Date(date_after)).getTime();
    return before <= after - duration * 60000;
}

export const withinDayLimits = (date, duration) => {
    const startHour = config.periods.startHour
    const endHour = config.periods.endHour
    const start = (date.getHours() - startHour) * 60 + date.getMinutes()
    const end = start + +duration
    return start >= 0 && end <= (endHour - startHour) * 60
}

