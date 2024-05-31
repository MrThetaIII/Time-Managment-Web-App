import { form_content_container_style } from "./form-content-styles";
import { useContext, useState, useEffect } from "react";
import { tasksContext, taskIDContext } from "../../../App";
import axios from "axios";
import { reloadContext, windowContext } from "../../../App";
import { date_time_stringify, withinDayLimits, isBeforeByDuration } from "../../../utility/time_manipulation";
import { isOccupied, getLastTaskExtension } from "../../../utility/tasks_manipulation";

function ExtendTask() {
    const { tasks } = useContext(tasksContext);
    const { taskID } = useContext(taskIDContext);

    const task = tasks.find((task) => task.id === taskID);
    const date = new Date((new Date(task.time)).getTime() + (task.duration * 60000));
    const dateStr = date_time_stringify(date);

    const { setReload } = useContext(reloadContext);
    const { setWindow } = useContext(windowContext);

    const [time, setTime] = useState(dateStr);
    const [taskDuration, setTaskDuration] = useState(60)

    const [occupied, setOccupied] = useState(true);
    const [validDuration, setValidDuration] = useState(true);
    const [inDayLimits, setInDayLimits] = useState(false);
    const [afterLastExtension, setAfterLastExtension] = useState(false);

    useEffect(() => {
        isOccupied(new Date(time), taskDuration).then((res) => { setOccupied(res) });
        setInDayLimits(withinDayLimits(new Date(time), taskDuration));
    }, [time, taskDuration]);
    useEffect(() => {
        setValidDuration(taskDuration >= 5);
    }, [taskDuration]);
    useEffect(() => {
        getLastTaskExtension(taskID).then((res) => {
            res !== null ? setAfterLastExtension(isBeforeByDuration(new Date(res.time), new Date(time), res.duration)) : setAfterLastExtension(true);
        });
    }, [time, taskID]);

    const extendTask = async () => {
        try {
            await axios.post('http://localhost:5000/api/task-extensions/create', { task_id: taskID, time: time, duration: taskDuration });
            setReload((reload) => !reload);
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div style={form_content_container_style}>
            <h1>Extending Task: {task.name}</h1>
            <table>
                <tbody>
                    <tr>
                        <td>Time</td>
                        <td><input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Duration</td>
                        <td><input type="number" value={taskDuration} onChange={(e) => setTaskDuration(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>
            <div>
                {occupied && <span style={{ color: 'red' }}>[Occupied]</span>}
                {!inDayLimits && <span style={{ color: 'red' }}>[Out of Day Limits]</span>}
                {!validDuration && <span style={{ color: 'red' }}>[Invalid Duration]</span>}
                {!afterLastExtension && <span style={{ color: 'red' }}>[Before Last Extension]</span>}
            </div>
            {!occupied && inDayLimits && validDuration && afterLastExtension ? <button onClick={extendTask}>Extend Task</button> : <button disabled>Extend Task</button>}
        </div>
    );
}

export default ExtendTask;