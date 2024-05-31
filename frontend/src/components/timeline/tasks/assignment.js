/* eslint-disable react-hooks/exhaustive-deps */
import { task_style, state_style } from "./task-styles";
import { useEffect, useState, useContext } from "react";
import { reloadContext, infoContext } from "../../../App";
import { near } from "../../../utility/time_manipulation";
import { getLastAssignmentExtension } from "../../../utility/tasks_manipulation";
import config from "../../../config.json";
import notify from "../../../utility/notify";
import '../time-line-styles.css';


function Assignment(props) {
    const { setInfo } = useContext(infoContext);
    const { assignment, onClick } = props;

    const [lastExtension, setLastExtension] = useState(null);
    const [eventClock, setEventClock] = useState(0);

    const [state, setState] = useState(config.states.assignment_states.idle);

    const { reload } = useContext(reloadContext);

    useEffect(() => {
        const setValue = async () => { setLastExtension(await getLastAssignmentExtension(assignment.id)) };
        setValue()
    }, [assignment.id, reload]);

    useEffect(() => {
        const interval = setInterval(() => {
            setEventClock(prev => prev + 1);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (assignment.completed && near(assignment.deadline, 0)) {
            if (state !== config.states.assignment_states.completed_after_deadline) {
                setState(config.states.assignment_states.completed_after_deadline);
            }
        }
        else if (assignment.completed) {
            if (state !== config.states.assignment_states.completed_before_deadline) {
                setState(config.states.assignment_states.completed_before_deadline);
            }
        }
        else if (lastExtension != null && near(lastExtension.time, -lastExtension.duration)) {
            if (state !== config.states.assignment_states.ended_uncompleted) {
                setState(config.states.assignment_states.ended_uncompleted);
                eventClock > 0 && notify("Assignment time ended", assignment.name)
            }
        }
        else if (lastExtension != null && near(lastExtension.time, -lastExtension.duration + config.periods.notificationPeriod)) {
            if (state !== config.states.assignment_states.about_to_finalize) {
                setState(config.states.assignment_states.about_to_finalize);
                eventClock > 0 && notify("Assignment time is about to end", assignment.name)
            }
        }
        else if (near(assignment.deadline, 0)) {
            if (state !== config.states.assignment_states.overdue) {
                setState(config.states.assignment_states.overdue);
                eventClock > 0 && notify("Assignment deadline was passed", assignment.name)
            }
        }
        else if (near(assignment.deadline, assignment.duration)) {
            if (state !== config.states.assignment_states.about_to_be_overdue) {
                setState(config.states.assignment_states.about_to_be_overdue);
                eventClock > 0 && notify("Assignment deadline is about to pass", assignment.name)
            }
        }
        else if (lastExtension != null && !near(lastExtension.time, -lastExtension.duration)) {
            if (state !== config.states.assignment_states.due_extension) {
                setState(config.states.assignment_states.due_extension);
                eventClock > 0 && notify("Assignment time ended", assignment.name)
            }
        }
        else if (near(assignment.time, -assignment.duration)) {
            if (state !== config.states.assignment_states.ended_uncompleted) {
                setState(config.states.assignment_states.ended_uncompleted);
                eventClock > 0 && notify("Assignment time ended", assignment.name)
            }
        }
        else if (near(assignment.time, -assignment.duration + config.periods.notificationPeriod)) {
            if (state !== config.states.assignment_states.about_to_end) {
                setState(config.states.assignment_states.about_to_end);
                eventClock > 0 && notify("Assignment time is about to end", assignment.name)
            }
        }
        else if (near(assignment.time, 0)) {
            if (state !== config.states.assignment_states.in_progress) {
                setState(config.states.assignment_states.in_progress);
                eventClock > 0 && notify("Assignment time started", assignment.name)
            }
        }
        else if (near(assignment.time, config.periods.notificationPeriod)) {
            if (state !== config.states.assignment_states.about_to_start) {
                setState(config.states.assignment_states.about_to_start);
                eventClock > 0 && notify("Assignment time is about to start", assignment.name)
            }
        }
        else {
            if (state !== config.states.assignment_states.idle) {
                setState(config.states.assignment_states.idle);
            }
        }
    }, [assignment, lastExtension, eventClock]);

    const handle_mouse_enter = () => {
        setInfo({ startingAt: assignment.start_at, lastingFor: assignment.duration, state: state.name });
    }
    const handle_mouse_leave = () => {
        setInfo({ startingAt: '', LastingFor: '', state: '' });
    }

    return (
        <div
            style={task_style(assignment.start, assignment.duration, assignment.day, assignment.color)}
            onMouseEnter={handle_mouse_enter}
            onMouseLeave={handle_mouse_leave}
            className={'has_scrollbar'}
            onClick={onClick}
        >

            <span style={state_style(state.color)} /> Assignment: {assignment.name} <br />
            For: {assignment.event_name}
        </div>
    );
}

export default Assignment;