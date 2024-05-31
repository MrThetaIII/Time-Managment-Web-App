/* eslint-disable eqeqeq */
import { form_content_container_style } from "./form-content-styles";
import './form-content-styles.css'
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { reloadContext, windowContext, taskIDContext, tasksContext } from "../../../App";
import { date_time_stringify, isBeforeByDuration, withinDayLimits } from "../../../utility/time_manipulation";
import { isOccupied } from "../../../utility/tasks_manipulation";

function AddAssignment() {
    const { taskID } = useContext(taskIDContext);
    const { scheduledEvents } = useContext(tasksContext);
    const event = scheduledEvents.find(event => event.instance_id == taskID);

    const [assignmentName, setAssignmentName] = useState("");
    const [assignmentDescription, setAssignmentDescription] = useState("");

    const date = new Date(event.current_date);
    date.setTime(date.getTime() + (+event.start_at.split(':')[0] - date.getHours()) * 3600000 + (+event.start_at.split(':')[1] + event.duration) * 60000);
    const dateStr = date_time_stringify(date);

    const [assignmentTime, setAssignmentTime] = useState(dateStr);
    const [assignmentDuration, setAssignmentDuration] = useState(60);

    const dead_line = new Date(date);
    dead_line.setDate(dead_line.getDate() + 6);
    const dateStr_tomorrow = date_time_stringify(dead_line);

    const [assignmentDeadLine, setAssignmentDeadLine] = useState(dateStr_tomorrow);


    const { setReload } = useContext(reloadContext);
    const { setWindow } = useContext(windowContext);

    const [occupied, setOccupied] = useState(true);
    const [validDeadline, setValidDeadline] = useState(false);
    const [validInfo, setValidInfo] = useState(false);
    const [validDuration, setValidDuration] = useState(true);
    const [inDayLimits, setInDayLimits] = useState(false);

    useEffect(() => {
        isOccupied(new Date(assignmentTime), assignmentDuration).then((res) => { setOccupied(res) });
        setInDayLimits(withinDayLimits(new Date(assignmentTime), assignmentDuration));
    }, [assignmentTime, assignmentDuration]);
    useEffect(() => {
        setValidDeadline(isBeforeByDuration(new Date(assignmentTime), new Date(assignmentDeadLine), assignmentDuration));
    }, [assignmentTime, assignmentDuration, assignmentDeadLine]);
    useEffect(() => {
        setValidInfo(assignmentName !== "" && assignmentDescription !== "");
    }, [assignmentName, assignmentDescription]);
    useEffect(() => {
        setValidDuration(assignmentDuration >= 5);
    }, [assignmentDuration]);



    const addAssignment = async () => {
        try {
            await axios.post("http://localhost:5000/api/assignments/create", { name: assignmentName, description: assignmentDescription, time: assignmentTime, duration: assignmentDuration, deadline: assignmentDeadLine, task_id: event.id })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div style={form_content_container_style}>
            <h1>Add assignment for: {event.name}</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="assignment-name">Assignment Name</label>
                        </td>
                        <td>
                            <input type="text" id="assignment-name" value={assignmentName} onChange={(e) => setAssignmentName(e.target.value)} placeholder="Assignment Name" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignment-description">Assignment Description</label>
                        </td>
                        <td>
                            <textarea id="assignment-description" value={assignmentDescription} onChange={(e) => setAssignmentDescription(e.target.value)} placeholder="Assignment Description" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignment-time">
                                Assignment Time
                            </label>
                        </td>
                        <td>
                            <input type="datetime-local" id="assignment-time" value={assignmentTime} onChange={(e) => setAssignmentTime(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignment-duration">Assignment Duration</label>
                        </td>
                        <td>
                            <input type="number" id="assignment-duration" value={assignmentDuration} onChange={(e) => setAssignmentDuration(e.target.value)} min={5} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignment-deadline">Assignment Deadline</label>
                        </td>
                        <td>
                            <input type="datetime-local" id="assignment-deadline" value={assignmentDeadLine} onChange={(e) => setAssignmentDeadLine(e.target.value)} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                {occupied && <span style={{ color: "red" }}> [Occupied] </span>}
                {!validDeadline && <span style={{ color: "red" }}> [Invalid Deadline] </span>}
                {!validInfo && <span style={{ color: "red" }}> [Invalid Info] </span>}
                {!validDuration && <span style={{ color: "red" }}> [Invalid Duration] </span>}
                {!inDayLimits && <span style={{ color: "red" }}> [Out of Day Limits] </span>}
            </div>
            {!occupied && validInfo && validDeadline && validDuration && inDayLimits ? <button onClick={addAssignment}>Add Assignment</button> : <button disabled>Add Assignment</button>}
        </div>
    );
}


export default AddAssignment;