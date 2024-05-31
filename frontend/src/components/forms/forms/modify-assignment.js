import { form_content_container_style } from "./form-content-styles";
import { useContext, useState, useEffect } from "react";
import { tasksContext, taskIDContext, reloadContext, windowContext } from "../../../App";
import axios from "axios";
import { date_time_stringify, isBeforeByDuration, withinDayLimits } from "../../../utility/time_manipulation";
import { isOccupiedExcept } from "../../../utility/tasks_manipulation";

function ModifyAssignment() {
    const { assignments } = useContext(tasksContext);
    const { taskID } = useContext(taskIDContext);
    const assignment = assignments.find((assignment) => assignment.id === taskID);

    const { setReload } = useContext(reloadContext);
    const { setWindow } = useContext(windowContext);
    const [changed, setChanged] = useState(false);

    const [assignmentName, setAssignmentName] = useState(assignment.name);
    const [assignmentDescription, setAssignmentDescription] = useState(assignment.description);
    const date = new Date(assignment.time);
    const dateStr = date_time_stringify(date);
    const [assignmentTime, setAssignmentTime] = useState(dateStr);
    const [assignmentDuration, setAssignmentDuration] = useState(assignment.duration);
    const dead_line = new Date(assignment.deadline);
    const dead_lineStr = date_time_stringify(dead_line);
    const [assignmentDeadLine, setAssignmentDeadLine] = useState(dead_lineStr);
    const [assignmentColor, setAssignmentColor] = useState(assignment.color);
    const [assignmentCompleted, setAssignmentCompleted] = useState(assignment.completed);

    const [occupied, setOccupied] = useState(true);
    const [validDeadline, setValidDeadline] = useState(false);
    const [validInfo, setValidInfo] = useState(false);
    const [validDuration, setValidDuration] = useState(true);
    const [inDayLimits, setInDayLimits] = useState(false);

    useEffect(() => {
        isOccupiedExcept(new Date(assignmentTime), assignmentDuration, 'assignments', assignment.id).then((res) => { setOccupied(res) });
        setInDayLimits(withinDayLimits(new Date(assignmentTime), assignmentDuration));
    }, [assignmentTime, assignmentDuration, assignment.id]);
    useEffect(() => {
        setValidDeadline(isBeforeByDuration(new Date(assignmentTime), new Date(assignmentDeadLine), assignmentDuration));
    }, [assignmentTime, assignmentDeadLine, assignmentDuration]);

    useEffect(() => {
        setValidInfo(assignmentName !== '' && assignmentDescription !== '');
    }, [assignmentName, assignmentDescription]);
    useEffect(() => {
        setValidDuration(assignmentDuration >= 5);
    }, [assignmentDuration]);

    const modifyAssignment = async () => {
        try {
            await axios.put("http://localhost:5000/api/assignments/update", { id: assignment.id, name: assignmentName, description: assignmentDescription, time: assignmentTime, duration: assignmentDuration, deadline: assignmentDeadLine, color: assignmentColor, completed: assignmentCompleted })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    const deleteAssignment = async () => {
        try {
            await axios.put("http://localhost:5000/api/assignments/delete", { id: assignment.id })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    const extendAssignment = () => { setWindow('Extend Assignment') }

    return (
        <div style={form_content_container_style}>
            <h1>Modify Assignment</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="assignment-name">Name</label>
                        </td>
                        <td>
                            <input type="text" id="assignment-name" value={assignmentName} onChange={(e) => { setAssignmentName(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignment-description">Description</label>
                        </td>
                        <td>
                            <input type="text" id="assignment-description" value={assignmentDescription} onChange={(e) => { setAssignmentDescription(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignment-time">Time</label>
                        </td>
                        <td>
                            <input type="datetime-local" id="assignment-time" value={assignmentTime} onChange={(e) => { setAssignmentTime(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignment-duration">Duration</label>
                        </td>
                        <td>
                            <input type="number" id="assignment-duration" value={assignmentDuration} onChange={(e) => { setAssignmentDuration(e.target.value); setChanged(true) }} min={5} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignment-deadline">Deadline</label>
                        </td>
                        <td>
                            <input type="datetime-local" id="assignment-deadline" value={assignmentDeadLine} onChange={(e) => { setAssignmentDeadLine(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignment-color">Color</label>
                        </td>
                        <td>
                            <input type="color" id="assignment-color" value={assignmentColor} onChange={(e) => { setAssignmentColor(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignment-completed">Completed</label>
                        </td>
                        <td>
                            <input type="checkbox" id="assignment-completed" checked={assignmentCompleted} onChange={(e) => { setAssignmentCompleted(e.target.checked); setChanged(true) }} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                {occupied && <span style={{ color: 'red' }}>[Occupied]</span>}
                {!validDeadline && <span style={{ color: 'red' }}>[Invalid Deadline]</span>}
                {!validInfo && <span style={{ color: 'red' }}>[Invalid Info]</span>}
                {!validDuration && <span style={{ color: 'red' }}>[Invalid Duration]</span>}
                {!inDayLimits && <span style={{ color: 'red' }}>[Out of Day Limits]</span>}
            </div>
            <div className="button_container">
                {!occupied && validDeadline && validDuration && validInfo && inDayLimits && changed ? <button onClick={modifyAssignment}>Modify</button> : <button disabled>Modify</button>}
                <button onClick={extendAssignment}>Extend</button>
                <button onClick={deleteAssignment}>Delete</button>
            </div>
        </div>
    );
}

export default ModifyAssignment;