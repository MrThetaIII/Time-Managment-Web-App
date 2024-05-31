import { form_content_container_style } from "./form-content-styles";
import { useContext, useState, useEffect } from "react";
import { tasksContext, taskIDContext, reloadContext, windowContext } from "../../../App";
import axios from "axios";
import { date_time_stringify, isBeforeByDuration, withinDayLimits } from "../../../utility/time_manipulation";
import { isOccupiedExcept } from "../../../utility/tasks_manipulation";

function ModifyAssignmentExtension() {
    const { assignmentExtensions, assignments } = useContext(tasksContext);
    const { taskID, setTaskID } = useContext(taskIDContext);
    const assignmentExtension = assignmentExtensions.find((assignmentExtension) => assignmentExtension.id === taskID);
    const assignment = assignments.find((assignment) => assignment.id === assignmentExtension.assignment_id);

    const { setReload } = useContext(reloadContext);
    const { setWindow } = useContext(windowContext);
    const [changed, setChanged] = useState(false);

    const date = new Date(assignmentExtension.time);
    const dateStr = date_time_stringify(date);

    const [assignmentExtensionTime, setAssignmentExtensionTime] = useState(dateStr);
    const [assignmentExtensionDuration, setAssignmentExtensionDuration] = useState(assignmentExtension.duration);
    const [assignmentExtensionColor, setAssignmentExtensionColor] = useState(assignmentExtension.color);
    const [assignmentExtensionCompleted, setAssignmentExtensionCompleted] = useState(assignmentExtension.completed);

    const [occupied, setOccupied] = useState(true);
    const [validDeadline, setValidDeadline] = useState(false);
    const [validDuration, setValidDuration] = useState(true);
    const [inDayLimits, setInDayLimits] = useState(false);

    useEffect(() => {
        isOccupiedExcept(new Date(assignmentExtensionTime), assignmentExtensionDuration, "assignmentExtensions", assignmentExtension.id).then((res) => {
            setOccupied(res);
        });
        setInDayLimits(withinDayLimits(new Date(assignmentExtensionTime), assignmentExtensionDuration));
    }, [assignmentExtensionTime, assignmentExtensionDuration, assignmentExtension.id]);
    useEffect(() => {
        setValidDeadline(isBeforeByDuration(new Date(assignmentExtensionTime), new Date(assignment.deadline), assignmentExtensionDuration));
    }, [assignment.deadline, assignmentExtensionDuration, assignmentExtensionTime]);
    useEffect(() => {
        setValidDuration(assignmentExtensionDuration > 0);
    }, [assignmentExtensionDuration]);

    const modifyAssignmentExtension = async () => {
        try {
            await axios.put("http://localhost:5000/api/assignment-extensions/update", { id: assignmentExtension.id, assignment_id: assignmentExtension.assignment_id, time: assignmentExtensionTime, duration: assignmentExtensionDuration, color: assignmentExtensionColor, completed: assignmentExtensionCompleted })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    const deleteAssignmentExtension = async () => {
        try {
            await axios.put("http://localhost:5000/api/assignment-extensions/delete", { id: assignmentExtension.id })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    const extendFurther = () => {
        setWindow("Extend Assignment")
        setTaskID(assignmentExtension.assignment_id)
    }

    return (
        <div style={form_content_container_style}>
            <h1>Modifying the Assignment Extension: {assignmentExtension.assignment_name}</h1>
            <h2>{assignmentExtension.description}</h2>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="assignmentExtensionTime">Time:</label>
                        </td>
                        <td>
                            <input type="datetime-local" id="assignmentExtensionTime" name="assignmentExtensionTime" value={assignmentExtensionTime} onChange={(e) => { setAssignmentExtensionTime(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignmentExtensionDuration">Duration:</label>
                        </td>
                        <td>
                            <input type="number" id="assignmentExtensionDuration" name="assignmentExtensionDuration" value={assignmentExtensionDuration} onChange={(e) => { setAssignmentExtensionDuration(e.target.value); setChanged(true) }} max={5} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignmentExtensionColor">Color:</label>
                        </td>
                        <td>
                            <input type="color" id="assignmentExtensionColor" name="assignmentExtensionColor" value={assignmentExtensionColor} onChange={(e) => { setAssignmentExtensionColor(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="assignmentExtensionCompleted">Completed:</label>
                        </td>
                        <td>
                            <input type="checkbox" id="assignmentExtensionCompleted" name="assignmentExtensionCompleted" checked={assignmentExtensionCompleted} onChange={(e) => { setAssignmentExtensionCompleted(e.target.checked); setChanged(true) }} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                {occupied && <span style={{ color: "red" }}>[Occupied]</span>}
                {!validDeadline && <span style={{ color: "red" }}>[Deadline Exceeded]</span>}
                {!validDuration && <span style={{ color: "red" }}>[Invalid Duration]</span>}
                {!inDayLimits && <span style={{ color: "red" }}>[Out of Day Limits]</span>}
            </div>
            <div className="button_container">
                {changed && !occupied && validDeadline && validDuration && inDayLimits ? <button onClick={modifyAssignmentExtension}>Modify</button> : <button disabled>Modify</button>}
                <button onClick={deleteAssignmentExtension}>Delete</button>
                <button onClick={extendFurther}>Extend Further</button>
            </div>
        </div>
    );
}

export default ModifyAssignmentExtension;