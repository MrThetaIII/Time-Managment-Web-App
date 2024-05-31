/* eslint-disable react-hooks/exhaustive-deps */
import { task_style, state_style } from "./task-styles";
import { useEffect, useState, useContext } from "react";
import { reloadContext, infoContext } from "../../../App";
import { near } from "../../../utility/time_manipulation";
import { getLastAssignmentExtension } from "../../../utility/tasks_manipulation";
import config from "../../../config.json";
import notify from "../../../utility/notify";
import '../time-line-styles.css';

function AssignmentExtension(props) {
    const { setInfo } = useContext(infoContext);
    const { assignmentExtension, onClick } = props;

    const [lastExtension, setLastExtension] = useState(null);
    const [eventClock, setEventClock] = useState(0);

    const [state, setState] = useState(config.states.assignment_extension_states.idle);

    const { reload } = useContext(reloadContext);

    useEffect(() => {
        const setValue = async () => { setLastExtension(await getLastAssignmentExtension(assignmentExtension.assignment_id)) };
        setValue()
    }, [assignmentExtension.assignment_id, reload]);

    useEffect(() => {
        const interval = setInterval(() => {
            setEventClock(prev => prev + 1);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (assignmentExtension.completed && near(assignmentExtension.deadline, 0)) {
            if (state !== config.states.assignment_extension_states.completed_after_deadline) {
                setState(config.states.assignment_extension_states.completed_after_deadline);
            }
        }
        else if (assignmentExtension.completed) {
            if (state !== config.states.assignment_extension_states.completed_before_deadline) {
                setState(config.states.assignment_extension_states.completed_before_deadline);
            }
        }
        else if (lastExtension != null && near(lastExtension.time, -lastExtension.duration)) {
            if (state !== config.states.assignment_extension_states.ended_uncompleted) {
                setState(config.states.assignment_extension_states.ended_uncompleted);
            }
        }
        else if (lastExtension != null && lastExtension.time !== assignmentExtension.time && near(lastExtension.time, -lastExtension.duration + config.periods.notificationPeriod)) {
            if (state !== config.states.assignment_extension_states.about_to_finalize) {
                setState(config.states.assignment_extension_states.about_to_finalize);
            }
        }
        else if (near(assignmentExtension.deadline, 0)) {
            if (state !== config.states.assignment_extension_states.overdue) {
                setState(config.states.assignment_extension_states.overdue);
            }
        }
        else if (near(assignmentExtension.deadline, assignmentExtension.duration)) {
            if (state !== config.states.assignment_extension_states.about_to_be_overdue) {
                setState(config.states.assignment_extension_states.about_to_be_overdue);
            }
        }
        else if (lastExtension != null && lastExtension.time !== assignmentExtension.time && !near(lastExtension.time, -lastExtension.duration) && near(assignmentExtension.time, -assignmentExtension.duration)) {
            if (state !== config.states.assignment_extension_states.due_extension) {
                setState(config.states.assignment_extension_states.due_extension);
            }
        }
        else if (near(assignmentExtension.time, -assignmentExtension.duration)) {
            if (state !== config.states.assignment_extension_states.ended_uncompleted) {
                setState(config.states.assignment_extension_states.ended_uncompleted);
                eventClock > 0 && notify("Assignment extension ended", assignmentExtension.task_name)
            }
        }
        else if (near(assignmentExtension.time, -assignmentExtension.duration + config.periods.notificationPeriod)) {
            if (state !== config.states.assignment_extension_states.about_to_end) {
                setState(config.states.assignment_extension_states.about_to_end);
                eventClock > 0 && notify("Assignment extension is about to end", assignmentExtension.task_name)
            }
        }
        else if (near(assignmentExtension.time, 0)) {
            if (state !== config.states.assignment_extension_states.in_progress) {
                setState(config.states.assignment_extension_states.in_progress);
                eventClock > 0 && notify("Assignment extension started", assignmentExtension.task_name)
            }
        }
        else if (near(assignmentExtension.time, config.periods.notificationPeriod)) {
            if (state !== config.states.assignment_extension_states.about_to_start) {
                setState(config.states.assignment_extension_states.about_to_start);
                eventClock > 0 && notify("Assignment extension is about to start", assignmentExtension.task_name)
            }
        }
        else {
            if (state !== config.states.assignment_extension_states.idle) {
                setState(config.states.assignment_extension_states.idle);
            }
        }
    }, [assignmentExtension, lastExtension, eventClock]);



    const handle_mouse_enter = () => {
        setInfo({ startingAt: assignmentExtension.start_at, lastingFor: assignmentExtension.duration, state: state.name });
    }
    const handle_mouse_leave = () => {
        setInfo({ startingAt: '', LastingFor: '', state: '' });
    }

    return (
        <div
            style={task_style(assignmentExtension.start, assignmentExtension.duration, assignmentExtension.day, assignmentExtension.color)}
            onMouseEnter={handle_mouse_enter}
            onMouseLeave={handle_mouse_leave}
            onClick={onClick}
            className={'has_scrollbar'}
        >
            <span style={state_style(state.color)} /> Assign-Ext: {assignmentExtension.assignment_name}
        </div>
    );
}

export default AssignmentExtension;