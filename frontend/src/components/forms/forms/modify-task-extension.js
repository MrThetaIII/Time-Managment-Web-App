import { form_content_container_style } from "./form-content-styles";
import { useContext, useState, useEffect } from "react";
import { tasksContext, taskIDContext, reloadContext, windowContext } from "../../../App";
import axios from "axios";
import { date_time_stringify, withinDayLimits } from "../../../utility/time_manipulation";
import { isOccupiedExcept } from "../../../utility/tasks_manipulation";

function ModifyTaskExtension() {
    const { taskExtensions } = useContext(tasksContext);
    const { taskID, setTaskID } = useContext(taskIDContext);
    const taskExtension = taskExtensions.find((taskExtension) => taskExtension.id === taskID);

    const { setReload } = useContext(reloadContext);
    const { setWindow } = useContext(windowContext);
    const [changed, setChanged] = useState(false);

    const date = new Date(taskExtension.time);
    const dateStr = date_time_stringify(date);



    const [taskExtensionTime, setTaskExtensionTime] = useState(dateStr);
    const [taskExtensionDuration, setTaskExtensionDuration] = useState(taskExtension.duration);
    const [taskExtensionColor, setTaskExtensionColor] = useState(taskExtension.color);
    const [taskExtensionCompleted, setTaskExtensionCompleted] = useState(taskExtension.completed);

    const [occupied, setOccupied] = useState(true);
    const [validDuration, setValidDuration] = useState(true);
    const [inDayLimits, setInDayLimits] = useState(false);

    useEffect(() => {
        isOccupiedExcept(new Date(taskExtensionTime), taskExtensionDuration, "taskExtensions", taskExtension.id).then((res) => {
            setOccupied(res);
        });
        setInDayLimits(withinDayLimits(new Date(taskExtensionTime), taskExtensionDuration));
    }, [taskExtensionTime, taskExtensionDuration, taskExtension.id]);
    useEffect(() => {
        setValidDuration(taskExtensionDuration >= 5);
    }, [taskExtensionDuration]);

    const modifyTaskExtension = async () => {
        try {
            await axios.put("http://localhost:5000/api/task-extensions/update", { id: taskExtension.id, time: taskExtensionTime, duration: taskExtensionDuration, color: taskExtensionColor, completed: taskExtensionCompleted, task_id: taskExtension.task_id })
            setReload(prev => !prev)
            setWindow("idle")
        } catch (err) {
            console.log(err)
        }
    }

    const deleteTaskExtension = async () => {
        try {
            await axios.put("http://localhost:5000/api/task-extensions/delete", { id: taskExtension.id })
            setReload(prev => !prev)
            setWindow("idle")
        } catch (err) {
            console.log(err)
        }
    }

    const extendFurther = () => {
        setWindow("Extend Task")
        setTaskID(taskExtension.task_id)
    }

    return (
        <div style={form_content_container_style}>
            <h1>Modify The extension to the task: {taskExtension.task_name}</h1>
            <h2>{taskExtension.description}</h2>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="taskExtensionTime">Time:</label>
                        </td>
                        <td>
                            <input type="datetime-local" id="taskExtensionTime" name="taskExtensionTime" value={taskExtensionTime} onChange={(e) => { setTaskExtensionTime(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="taskExtensionDuration">Duration:</label>
                        </td>
                        <td>
                            <input type="number" id="taskExtensionDuration" name="taskExtensionDuration" value={taskExtensionDuration} onChange={(e) => { setTaskExtensionDuration(e.target.value); setChanged(true) }} min={5} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="taskExtensionColor">Color:</label>
                        </td>
                        <td>
                            <input type="color" id="taskExtensionColor" name="taskExtensionColor" value={taskExtensionColor} onChange={(e) => { setTaskExtensionColor(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="taskExtensionCompleted">Completed:</label>
                        </td>
                        <td>
                            <input type="checkbox" id="taskExtensionCompleted" name="taskExtensionCompleted" checked={taskExtensionCompleted} onChange={(e) => { setTaskExtensionCompleted(e.target.checked); setChanged(true) }} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                {occupied && <span style={{ color: "red" }}>[Occupied]</span>}
                {!validDuration && <span style={{ color: "red" }}>[Invalid Duration]</span>}
                {!inDayLimits && <span style={{ color: "red" }}>[Out of Day Limits]</span>}
            </div>
            <div className="button_container">
                {changed && !occupied && validDuration && inDayLimits ? <button onClick={modifyTaskExtension}>Modify</button> : <button disabled>Modify</button>}
                <button onClick={deleteTaskExtension}>Delete</button>
                <button onClick={extendFurther}>Extend Further</button>
            </div>
        </div>
    );
}

export default ModifyTaskExtension;