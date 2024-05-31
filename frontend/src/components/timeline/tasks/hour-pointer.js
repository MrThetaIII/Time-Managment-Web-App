import { task_style } from "./task-styles";
import { useState, useEffect } from "react";
import config from '../../../config.json';
import '../time-line-styles.css'


function HourPointer(props) {
    const [todayDay, setTodayDay] = useState(((new Date()).getDay() + 1) % 7);
    const [start, setStart] = useState((new Date()).getHours() * 60 + (new Date()).getMinutes() - config.periods.startHour * 60);
    const [end, setEnd] = useState(config.periods.endHour * 60 - (new Date()).getMinutes() - (new Date()).getHours() * 60 - 1);

    useEffect(() => {
        const recalculate = setInterval(() => {
            setTodayDay(((new Date()).getDay() + 1) % 7);
            setStart((new Date()).getHours() * 60 + (new Date()).getMinutes() - config.periods.startHour * 60);
            setEnd(config.periods.endHour * 60 - (new Date()).getMinutes() - (new Date()).getHours() * 60 - 3);
        }, 60000);
        return () => clearInterval(recalculate);
    }, []);

    return (
        end > 0 && start > 0 ? <div style={task_style(start, 1, todayDay, '#D5E5F5')} /> : null
    );
}

export default HourPointer;