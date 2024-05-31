/* eslint-disable eqeqeq */
import { form_content_container_style } from "./form-content-styles";
import { useContext, useState, useEffect } from "react";
import { tasksContext, taskIDContext, reloadContext, windowContext } from "../../../App";
import axios from "axios";
import { date_time_stringify, withinDayLimits } from "../../../utility/time_manipulation";
import { isOccupiedExcept } from "../../../utility/tasks_manipulation";

function ModifyTask() {
    const { tasks } = useContext(tasksContext);
    const { taskID } = useContext(taskIDContext);
    const task = tasks.find((task) => task.id === taskID);

    const date = new Date(task.time);
    const dateStr = date_time_stringify(date);

    const { setReload } = useContext(reloadContext);
    const { setWindow } = useContext(windowContext);

    const modifyTask = async () => {
        try {
            await axios.put("http://localhost:5000/api/tasks/update-task", { id: task.id, color: taskColor, completed: taskCompleted, name: taskName, description: taskDescription, time: taskTime, duration: taskDuration })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    const deleteTask = async () => {
        try {
            await axios.put("http://localhost:5000/api/tasks/delete-task", { id: task.id })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    const [taskName, setTaskName] = useState(task.name)
    const [taskDescription, setTaskDescription] = useState(task.description)
    const [taskTime, setTaskTime] = useState(dateStr)
    const [taskDuration, setTaskDuration] = useState(task.duration)
    const [taskColor, setTaskColor] = useState(task.color)
    const [taskCompleted, setTaskCompleted] = useState(task.completed)
    const [changed, setChanged] = useState(false)

    const [occupied, setOccupied] = useState(true);
    const [validInfo, setValidInfo] = useState(false);
    const [validDuration, setValidDuration] = useState(true);
    const [inDayLimits, setInDayLimits] = useState(false);

    useEffect(() => {
        isOccupiedExcept(new Date(taskTime), taskDuration, 'tasks', task.id).then((res) => {
            setOccupied(res);
        });
        setInDayLimits(withinDayLimits(new Date(taskTime), taskDuration));
    }, [taskTime, taskDuration, task.id]);
    useEffect(() => {
        setValidInfo(taskName !== "" && taskDescription !== "");
    }, [taskName, taskDescription]);
    useEffect(() => {
        setValidDuration(taskDuration >= 5);
    }, [taskDuration]);

    return (
        <div style={form_content_container_style}>
            <h1>Modify the task</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="task_name"> Task Name </label>
                        </td>
                        <td>
                            <input type='text' id="task_name" value={taskName} onChange={(e) => { setTaskName(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="task_description"> Task Description </label>
                        </td>
                        <td>
                            <textarea id="task_description" value={taskDescription} onChange={(e) => { setTaskDescription(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="task_time"> Task Time </label>
                        </td>
                        <td>
                            <input type='datetime-local' id="task_time" value={taskTime} onChange={(e) => { setTaskTime(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="task_duration"> Task Duration </label>
                        </td>
                        <td>
                            <input type='number' id="task_duration" value={taskDuration} onChange={(e) => { setTaskDuration(e.target.value); setChanged(true) }} min={5} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="task_color"> Task Color </label>
                        </td>
                        <td>
                            <input type='color' id="task_color" value={taskColor} onChange={(e) => { setTaskColor(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="task_completed"> Task Fulfillment </label>
                        </td>
                        <td>
                            <input type="checkbox" id="task_completed" checked={taskCompleted} onChange={(e) => { setTaskCompleted(e.target.checked); setChanged(true) }} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                {occupied && <span style={{ color: 'red' }}>[Occupied]</span>}
                {!validInfo && <span style={{ color: 'red' }}>[Invalid Info]</span>}
                {!validDuration && <span style={{ color: 'red' }}>[Invalid Duration]</span>}
                {!inDayLimits && <span style={{ color: 'red' }}>[Out of Day Limits]</span>}
            </div>
            <div className="button_container">
                {changed && !occupied && validDuration && validInfo && inDayLimits ? <button onClick={modifyTask}>Update</button> : <button disabled>Update</button>}
                <button onClick={() => { setWindow('Extend Task') }}>Extend</button>
                <button onClick={deleteTask}>Delete</button>
            </div>
        </div>
    );
}

export default ModifyTask;