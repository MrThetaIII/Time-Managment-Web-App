import React from "react";
import Task from "./tasks/task";
import Scheduled from "./tasks/scheduled";
import Assignment from "./tasks/assignment";
import AssignmentExtension from "./tasks/assignment-extension";
import TaskExtension from "./tasks/task-extension";
import { task_canvas_style } from "./time-line-styles";
import { useContext } from "react";
import { tasksContext, taskIDContext, windowContext } from "../../App";
import HourPointer from "./tasks/hour-pointer";

function TaskCanvas() {

    const {
        tasks,
        scheduledEvents,
        assignments,
        assignmentExtensions,
        taskExtensions,
    } = useContext(tasksContext);
    const { setTaskID } = useContext(taskIDContext);
    const { setWindow } = useContext(windowContext);

    return (
        <div style={task_canvas_style}>
            {scheduledEvents.map((event) => {
                return (
                    <Scheduled
                        key={event.instance_id}
                        event={event}
                        onClick={() => { setTaskID(event.instance_id); setWindow('Modify Event') }}
                    ></Scheduled>
                )
            }
            )}
            {assignments.map((assignment) => {
                return (
                    <Assignment
                        key={assignment.id}
                        assignment={assignment}
                        onClick={() => { setTaskID(assignment.id); setWindow('Modify Assignment') }}
                    ></Assignment>
                )
            })}
            {tasks.map((task) => {
                return (
                    <Task
                        key={task.id}
                        task={task}
                        onClick={() => { setTaskID(task.id); setWindow('Modify Task') }}
                    ></Task>
                )
            })}
            {taskExtensions.map((taskExtension) => {
                return (
                    <TaskExtension
                        key={taskExtension.id}
                        taskExtension={taskExtension}
                        onClick={() => { setTaskID(taskExtension.id); setWindow('Modify Task Extension') }}
                    ></TaskExtension>
                )
            })}
            {assignmentExtensions.map((assignmentExtension) => {
                return (
                    <AssignmentExtension
                        key={assignmentExtension.id}
                        assignmentExtension={assignmentExtension}
                        onClick={() => { setTaskID(assignmentExtension.id); setWindow('Modify Assignment Extension') }}
                    ></AssignmentExtension>
                )
            })}
            <HourPointer />
        </div>
    );
}

export default TaskCanvas;
