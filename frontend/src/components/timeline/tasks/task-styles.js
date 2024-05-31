import config from '../../../config.json';


export const task_style = (start, period, day, color) => ({
    position: 'absolute',
    top: `${config.measurements.pixelsPerDay * day}px`,
    left: `${config.measurements.pixelsPerMinute * start}px`,
    height: `${config.measurements.pixelsPerDay}px`,
    width: `${config.measurements.pixelsPerMinute * period}px`,
    border: '1px solid',
    borderRadius: '10px',
    backgroundColor: color,
    boxSizing: 'border-box',
    textAlign: 'left',
    paddingLeft: '10px',
    paddingTop: '5px',
    fontSize: '0.8em',
    fontFamily: 'cursive',
    overflow: 'auto',
    whiteSpace: 'nowrap',
})

export const state_style = (color) => ({
    display: 'inline-block',
    backgroundColor: color,
    height: '0.7em',
    width: '0.7em',
    borderRadius: '50%',
})