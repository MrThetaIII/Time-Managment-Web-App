/* eslint-disable eqeqeq */
import React, { useContext } from 'react';
import { color_grid_style, grid_day_style, grid_header_style, grid_hour_style, grid_corner_style } from './time-line-styles';
import config from '../../config.json';
import TaskCanvas from './task-canvas';
import { daysOfTheWeek } from "../../utility/time_manipulation";
import { dateContext } from "../../App";

const { endHour, startHour } = config.periods;
const days = Array.from(config.days);
const hours = Array.from(Array(endHour - startHour).keys())
    .map(hour => hour + startHour)
    .map(hour => `${hour.toString().padStart(2, '0')}:00`);

function ColorGrid() {
    const { day } = useContext(dateContext);
    const dates = daysOfTheWeek(day);
    const current_day = new Date(day);
    const today = day => ((current_day.getDay() + 1) % 7) == day.ID;

    return (
        <div style={color_grid_style}>
            <div style={grid_corner_style}></div>
            {hours.map(hour => <div style={grid_header_style} key={hour}>{hour}</div>)}
            {days.map(day => (
                <React.Fragment key={day.ID}>
                    <div style={grid_day_style}>{day.name}<br />{dates[day.ID]}</div>
                    {hours.map(hour => <div style={grid_hour_style(day.ID % 2 === 0, today(day))} key={hour}></div>)}
                </React.Fragment>
            )
            )}
            <TaskCanvas />
        </div>
    );
}

export default ColorGrid;