/* eslint-disable eqeqeq */
import { form_content_container_style } from "./form-content-styles";
import './form-content-styles.css'
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { reloadContext, windowContext } from "../../../App";
import { date_time_stringify, withinDayLimits } from "../../../utility/time_manipulation";
import { isOccupied } from "../../../utility/tasks_manipulation";

function AddTask() {
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const date = new Date();
    const dateStr = date_time_stringify(date);
    const [taskTime, setTaskTime] = useState(dateStr);
    const [taskDuration, setTaskDuration] = useState(60);

    const { setReload } = useContext(reloadContext);
    const { setWindow } = useContext(windowContext);

    const [occupied, setOccupied] = useState(true);
    const [validInfo, setValidInfo] = useState(false);
    const [validDuration, setValidDuration] = useState(true);
    const [inDayLimits, setInDayLimits] = useState(false);

    useEffect(() => {
        isOccupied(new Date(taskTime), taskDuration).then((res) => { setOccupied(res) });
        setInDayLimits(withinDayLimits(new Date(taskTime), taskDuration));
    }, [taskTime, taskDuration]);
    useEffect(() => {
        setValidInfo(taskName !== "" && taskDescription !== "");
    }, [taskName, taskDescription]);
    useEffect(() => {
        setValidDuration(taskDuration >= 5);
    }, [taskDuration]);

    const addTask = async () => {
        try {
            await axios.post("http://localhost:5000/api/tasks/create-task", { name: taskName, description: taskDescription, time: taskTime, duration: taskDuration })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div style={form_content_container_style}>
            <h1>Adding a new task</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="task-name">Task Name</label>
                        </td>
                        <td>
                            <input type="text" id="task-name" value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="Task Name" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="task-description">Task Description</label>
                        </td>
                        <td>
                            <textarea id="task-description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Task Description" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="task-time">Task Time</label>
                        </td>
                        <td>
                            <input type="datetime-local" id="task-time" value={taskTime} onChange={(e) => setTaskTime(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="task-duration">Task Duration</label>
                        </td>
                        <td>
                            <input type="number" id="task-duration" value={taskDuration} onChange={(e) => setTaskDuration(e.target.value)} placeholder="Task Duration" min={5} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                {occupied && <span style={{ color: "red" }}>[Occupied]</span>}
                {!validInfo && <span style={{ color: "red" }}>[Invalid Info]</span>}
                {!validDuration && <span style={{ color: "red" }}>[Invalid Duration]</span>}
                {!inDayLimits && <span style={{ color: "red" }}>[Out of Day Limits]</span>}
            </div>
            <span>{!occupied && validInfo && validDuration && inDayLimits ? <button onClick={addTask}>Add Task</button> : <button disabled>Add Task</button>}</span>
        </div>
    );
}

export default AddTask;