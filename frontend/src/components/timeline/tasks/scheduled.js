/* eslint-disable react-hooks/exhaustive-deps */
import { task_style } from "./task-styles";
import { useState, useEffect, useContext } from "react";
import { reloadContext, infoContext } from "../../../App";
import { near } from "../../../utility/time_manipulation";
import config from "../../../config.json";
import notify from "../../../utility/notify";
import '../time-line-styles.css';

function Event(props) {
    const { event, onClick } = props;
    const { setInfo } = useContext(infoContext);

    const [eventClock, setEventClock] = useState(0);

    const [state, setState] = useState(config.states.scheduled_events_states.idle);

    const { reload } = useContext(reloadContext);

    const date = new Date(event.current_date);
    date.setTime(date.getTime() + (+event.start_at.split(':')[0] - date.getHours()) * 3600000 + (+event.start_at.split(':')[1] + event.duration) * 60000);

    useEffect(() => {
        const interval = setInterval(() => {
            setEventClock(prev => prev + 1);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (near(date, -event.duration)) {
            if (state !== config.states.scheduled_events_states.ended) {
                setState(config.states.scheduled_events_states.ended)
            }
        }
        else if (near(date, 0)) {
            if (state !== config.states.scheduled_events_states.in_progress) {
                setState(config.states.scheduled_events_states.in_progress)
                notify("Event Started", event.name)
            }
        }
        else if (near(date, config.periods.notificationPeriod)) {
            if (state !== config.states.scheduled_events_states.about_to_start) {
                setState(config.states.scheduled_events_states.about_to_start)
                notify("Event About To Start", event.name)
            }
        } else {
            if (state !== config.states.scheduled_events_states.idle) {
                setState(config.states.scheduled_events_states.idle)
            }
        }

    }, [reload, eventClock])

    const handle_mouse_enter = () => {
        setInfo({ startingAt: event.start_at, lastingFor: event.duration, state: state.name });
    }
    const handle_mouse_leave = () => {
        setInfo({ startingAt: '', LastingFor: '', state: '' });
    }

    return (
        <div
            style={task_style(event.start, event.duration, event.day, event.color)}
            className={'has_scrollbar'}
            onMouseEnter={handle_mouse_enter}
            onMouseLeave={handle_mouse_leave}
            onClick={onClick}
        >

            Schedule Event: {event.name}
        </div>
    );
}

export default Event;