import theme from '../../themes/blue';
import config from '../../config.json';

export const time_line_style = {

    width: '90vw',
    overflowX: 'scroll',
    marginTop: '5px',
    marginLeft: '5vw',
    border: `2px solid ${theme.primary_dark}`,
    borderRadius: '10px',
}

export const color_grid_container_style = {
    display: 'inline-flex',
    justifyContent: 'center',
};

export const color_grid_style = {
    backgroundColor: theme.gray_light,
    position: 'relative',
    padding: '0px',
    margin: '0px',
    display: 'grid',
    height: `${config.measurements.pixelsPerDay * config.days.length + config.measurements.headersHeight}px`,
    width: `${config.measurements.pixelsPerMinute * 60 * (config.periods.endHour - config.periods.startHour) + config.measurements.daysWidth}px`,
    gridTemplateRows: `${config.measurements.headersHeight}px repeat(${config.days.length}, ${config.measurements.pixelsPerDay}px)`,
    gridTemplateColumns: `${config.measurements.daysWidth}px repeat(${config.periods.endHour - config.periods.startHour}, ${config.measurements.pixelsPerMinute * 60}px)`,
}

export const grid_header_style = {
    backgroundColor: theme.primary_light,
    textAlign: 'left',
    padding: `${config.measurements.headersHeight - 25}px 0px 0px 5px`,
    borderTop: `1px solid ${theme.primary_dark}`,
    borderRight: `1px solid ${theme.primary_dark}`,
    boxSizing: 'border-box',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: '1.2em',
}

export const grid_day_style = {
    backgroundColor: theme.primary_light,
    textAlign: 'left',
    padding: `${config.measurements.pixelsPerDay - 50}px 0px 0px 5px`,
    borderTop: `1px solid ${theme.primary_dark}`,
    borderBottom: `1px solid ${theme.primary_dark}`,
    boxSizing: 'border-box',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: '1.2em',
}

export const grid_hour_style = (evens, today) => ({
    backgroundColor: evens && !today ? theme.tertiary_light : !evens && !today ? theme.secondary_light : theme.primary_dark,
    borderInline: '0.5px dashed black',
    borderTop: today ? `3px solid ${theme.white}` : 'none',
    borderBottom: today ? `3px solid ${theme.white}` : 'none',
    boxSizing: 'border-box',
})

export const grid_corner_style = {
    backgroundColor: theme.secondary_light,
    boxSizing: 'border-box',
}

export const task_canvas_style = {
    position: 'absolute',
    top: `${config.measurements.headersHeight}px`,
    left: `${config.measurements.daysWidth}px`,
    height: `${config.measurements.pixelsPerDay * config.days.length}px`,
    width: `${config.measurements.pixelsPerMinute * 60 * (config.periods.endHour - config.periods.startHour)}px`,
    backgroundColor: 'transparent',
    zIndex: '1',
    boxSizing: 'border-box',
}

export const task_info_style = {
    position: 'absolute',
    left: '50%',
    width: '300px',
    top: '-150%',
}

export const task_info_text_style = {
    position: 'relative',
    left: '-50%',
    backgroundColor: 'white',
    filter: 'opacity(0.8)',
    borderRadius: '10px',
    verticalAlign: 'middle',
    zIndex: 2,
    padding: '5px',
    fontFamily: 'cursive',
}