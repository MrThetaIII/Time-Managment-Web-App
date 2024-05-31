import React from 'react';
import ColorGrid from './timeline/color-grid';
import { color_grid_container_style, time_line_style } from './timeline/time-line-styles';
import './timeline/time-line-styles.css'

function TimeLine() {
    return (
        <div style={time_line_style} className={'has_scrollbar'}>
            <div style={color_grid_container_style}>
                <ColorGrid />
            </div>
        </div>
    );
}

export default TimeLine;