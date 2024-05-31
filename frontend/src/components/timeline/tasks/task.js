/* eslint-disable react-hooks/exhaustive-deps */
import { task_style, state_style } from "./task-styles";
import { useEffect, useState, useContext } from "react";
import { reloadContext, infoContext } from "../../../App";
import '../time-line-styles.css';
import { near } from "../../../utility/time_manipulation";
import { getLastTaskExtension } from "../../../utility/tasks_manipulation";
import config from "../../../config.json";
import notify from "../../../utility/notify";
import '../time-line-styles.css';

function Task(props) {
    const { setInfo } = useContext(infoContext);
    const { task, onClick } = props;

    const [lastExtension, setLastExtension] = useState(null);
    const [eventClock, setEventClock] = useState(0);

    const [state, setState] = useState(config.states.task_states.idle);

    const { reload } = useContext(reloadContext);

    useEffect(() => {
        const interval = setInterval(() => {
            setEventClock(prev => prev + 1);
        }, 60000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const setValue = async () => { setLastExtension(await getLastTaskExtension(task.id)) };
        setValue()
    }, [task.id, reload]);

    useEffect(() => {
        if (task.completed) {
            if (state !== config.states.task_states.completed) {
                setState(config.states.task_states.completed);
            }
        }
        else if (lastExtension != null && near(lastExtension.time, -lastExtension.duration)) {
            if (state !== config.states.task_states.ended_uncompleted) {
                setState(config.states.task_states.ended_uncompleted);
            }
        }
        else if (lastExtension != null && near(lastExtension.time, -lastExtension.duration + config.periods.notificationPeriod)) {
            if (state !== config.states.task_states.about_to_finalize) {
                setState(config.states.task_states.about_to_finalize);
                notify("Last time for this task is about to end", task.name)
            }
        }
        else if (lastExtension != null && !near(lastExtension.time, -lastExtension.duration)) {
            if (state !== config.states.task_states.due_extension) {
                setState(config.states.task_states.due_extension);
                notify("Task time ended.", task.name)
            }
        }
        else if (near(task.time, -task.duration)) {
            if (state !== config.states.task_states.ended_uncompleted) {
                setState(config.states.task_states.ended_uncompleted);
                notify("Task time ended.", task.name)
            }
        }
        else if (near(task.time, -task.duration + config.periods.notificationPeriod)) {
            if (state !== config.states.task_states.about_to_end) {
                setState(config.states.task_states.about_to_end);
                notify("Task time is about to end.", task.name)
            }
        }
        else if (near(task.time, 0)) {
            if (state !== config.states.task_states.in_progress) {
                setState(config.states.task_states.in_progress);
                notify("Task time started.", task.name)
            }
        }
        else if (near(task.time, config.periods.notificationPeriod)) {
            if (state !== config.states.task_states.about_to_start) {
                setState(config.states.task_states.about_to_start);
                notify("Task time is about to start.", task.name)
            }
        }
        else {
            if (state !== config.states.task_states.idle) {
                setState(config.states.task_states.idle);
            }
        }
    }, [task, lastExtension, eventClock]);

    const handle_mouse_enter = () => {
        setInfo({ startingAt: task.start_at, lastingFor: task.duration, state: state.name });
    }
    const handle_mouse_leave = () => {
        setInfo({ startingAt: '', LastingFor: '', state: '' });
    }

    return (
        <div
            style={task_style(task.start, task.duration, task.day, task.color)}
            onMouseEnter={handle_mouse_enter}
            onMouseLeave={handle_mouse_leave}
            className={'has_scrollbar'}
            onClick={onClick}
        >
            <span style={state_style(state.color)} /> Task: {task.name}
        </div>
    );
}

export default Task;