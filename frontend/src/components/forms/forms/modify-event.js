/* eslint-disable eqeqeq */
import { form_content_container_style } from "./form-content-styles";
import { useContext, useState } from "react";
import { tasksContext, taskIDContext, reloadContext, windowContext } from "../../../App";
import axios from "axios";
import { date_stringify } from "../../../utility/time_manipulation";

function ModifyEvent() {
    const { scheduledEvents } = useContext(tasksContext);
    const { taskID } = useContext(taskIDContext);
    const event = scheduledEvents.find((event) => event.instance_id === taskID);

    const s_date = new Date(event.start_date);
    const s_dateStr = date_stringify(s_date);
    const e_date = new Date(event.end_date);
    const e_dateStr = date_stringify(e_date);

    const { setReload } = useContext(reloadContext);
    const { setWindow } = useContext(windowContext);
    const [changed, setChanged] = useState(false);

    const modifyEvent = async () => {
        try {
            await axios.put("http://localhost:5000/api/scheduled-events/update", { id: event.id, name: eventName, description: eventDescription, start_date: eventStartDate, end_date: eventEndDate, start_at: eventStartAt, color: eventColor, repeat_every: eventRepeatEvery, duration: eventDuration })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    const deleteEvent = async () => {
        try {
            await axios.put("http://localhost:5000/api/scheduled-events/delete", { id: event.id })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    const addException = async () => {
        try {
            await axios.post("http://localhost:5000/api/exceptions/create", { task_id: event.id, date: event.current_date })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    const addAssignment = () => {
        setWindow('Add Assignment');
    }

    const [eventName, setEventName] = useState(event.name)
    const [eventDescription, setEventDescription] = useState(event.description)
    const [eventStartDate, setEventStartDate] = useState(s_dateStr)
    const [eventEndDate, setEventEndDate] = useState(e_dateStr)
    const [eventStartAt, setEventStartAt] = useState(event.start_at)
    const [eventColor, setEventColor] = useState(event.color)
    const [eventDuration, setEventDuration] = useState(event.duration)
    const [eventRepeatEvery, setEventRepeatEvery] = useState(event.repeat_every)



    return (
        <div style={form_content_container_style}>
            <h1>Modify Event</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="event_name"> Name </label>
                        </td>
                        <td>
                            <input type='text' id="event_name" value={eventName} onChange={(e) => { setEventName(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="event_description"> Description </label>
                        </td>
                        <td>
                            <textarea id="event_description" value={eventDescription} onChange={(e) => { setEventDescription(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="event_start_date"> Start Date </label>
                        </td>
                        <td>
                            <input type='date' id="event_start_date" value={eventStartDate} onChange={(e) => { setEventStartDate(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="event_end_date"> End Date </label>
                        </td>
                        <td>
                            <input type='date' id="event_end_date" value={eventEndDate} onChange={(e) => { setEventEndDate(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="event_start_at"> Start At </label>
                        </td>
                        <td>
                            <input type='time' id="event_start_at" value={eventStartAt} onChange={(e) => { setEventStartAt(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="event_color"> Color </label>
                        </td>
                        <td>
                            <input type='color' id="event_color" value={eventColor} onChange={(e) => { setEventColor(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="event_duration"> Duration </label>
                        </td>
                        <td>
                            <input type='number' id="event_duration" value={eventDuration} onChange={(e) => { setEventDuration(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="event_repeat_every"> Repeat Every </label>
                        </td>
                        <td>
                            <input type='number' id="event_repeat_every" value={eventRepeatEvery} onChange={(e) => { setEventRepeatEvery(e.target.value); setChanged(true) }} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="button_container">
                {changed ? <button onClick={modifyEvent}>Modify</button> : <button disabled>Modify</button>}
                <button onClick={deleteEvent}>Delete</button>
                <button onClick={addException}>Add Exception</button>
                <button onClick={addAssignment}>Add Assignment</button>
            </div>
        </div>
    );
}

export default ModifyEvent;