/* eslint-disable react-hooks/exhaustive-deps */
import { task_style, state_style } from "./task-styles";
import { useState, useEffect, useContext } from "react";
import { reloadContext, infoContext } from "../../../App";
import { near } from "../../../utility/time_manipulation";
import { getLastTaskExtension } from "../../../utility/tasks_manipulation";
import config from "../../../config.json";
import notify from "../../../utility/notify";
import '../time-line-styles.css';


function TaskExtension(props) {
    const { taskExtension, onClick } = props;
    const { setInfo } = useContext(infoContext);

    const [lastExtension, setLastExtension] = useState(null);
    const [eventClock, setEventClock] = useState(0);

    const [state, setState] = useState(config.states.task_extension_states.idle);

    const { reload } = useContext(reloadContext);

    useEffect(() => {
        const interval = setInterval(() => {
            setEventClock(prev => prev + 1);
        }, 60000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const setValue = async () => { setLastExtension(await getLastTaskExtension(taskExtension.task_id)) };
        setValue()
    }, [reload, taskExtension.task_id]);

    useEffect(() => {
        if (taskExtension.completed) {
            if (state !== config.states.task_extension_states.completed) {
                setState(config.states.task_extension_states.completed);
            }
        }
        else if (lastExtension != null && near(lastExtension.time, -lastExtension.duration)) {
            if (state !== config.states.task_extension_states.ended_uncompleted) {
                setState(config.states.task_extension_states.ended_uncompleted);
            }
        }
        else if (lastExtension != null && lastExtension.time !== taskExtension.time && near(lastExtension.time, -lastExtension.duration + config.periods.notificationPeriod)) {
            if (state !== config.states.task_extension_states.about_to_finalize) {
                setState(config.states.task_extension_states.about_to_finalize);
            }
        }
        else if (lastExtension != null && lastExtension.time !== taskExtension.time && !near(lastExtension.time, -lastExtension.duration) && near(taskExtension.time, -taskExtension.duration)) {
            if (state !== config.states.task_extension_states.due_extension) {
                setState(config.states.task_extension_states.due_extension);
            }
        }
        else if (near(taskExtension.time, -taskExtension.duration)) {
            if (state !== config.states.task_extension_states.ended_uncompleted) {
                setState(config.states.task_extension_states.ended_uncompleted);
                notify("Task extension ended", taskExtension.task_name)
            }
        }
        else if (near(taskExtension.time, -taskExtension.duration + config.periods.notificationPeriod)) {
            if (state !== config.states.task_extension_states.about_to_end) {
                setState(config.states.task_extension_states.about_to_end);
                notify("Task extension is about to end", taskExtension.task_name)
            }
        }
        else if (near(taskExtension.time, 0)) {
            if (state !== config.states.task_extension_states.in_progress) {
                setState(config.states.task_extension_states.in_progress);
                notify("Task extension started", taskExtension.task_name)
            }
        }
        else if (near(taskExtension.time, config.periods.notificationPeriod)) {
            if (state !== config.states.task_extension_states.about_to_start) {
                setState(config.states.task_extension_states.about_to_start);
                notify("Task extension about to start", taskExtension.task_name)
            }
        }
        else {
            if (state !== config.states.task_extension_states.idle) {
                setState(config.states.task_extension_states.idle);
            }
        }
    }, [taskExtension, lastExtension, eventClock]);

    const handle_mouse_enter = () => {
        setInfo({ startingAt: taskExtension.start_at, lastingFor: taskExtension.duration, state: state.name });
    }
    const handle_mouse_leave = () => {
        setInfo({ startingAt: '', LastingFor: '', state: '' });
    }

    return (
        <div
            style={task_style(taskExtension.start, taskExtension.duration, taskExtension.day, taskExtension.color)}
            onMouseEnter={handle_mouse_enter}
            onMouseLeave={handle_mouse_leave}
            className={'has_scrollbar'}
            onClick={onClick}
        >

            <span style={state_style(state.color)} /> Task-Ext: {taskExtension.task_name}
        </div>
    );
}

export default TaskExtension;