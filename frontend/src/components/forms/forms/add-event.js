/* eslint-disable eqeqeq */
import { form_content_container_style } from "./form-content-styles";
import './form-content-styles.css'
import axios from "axios";
import { useState, useContext } from "react";
import { reloadContext, windowContext } from "../../../App";
import { date_stringify } from "../../../utility/time_manipulation";

function AddEvent() {
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const start_date = new Date();
    const dateStr = date_stringify(start_date);
    const [startDate, setStartDate] = useState(dateStr);
    const [startAt, setStartAt] = useState("07:00");
    const [duration, setDuration] = useState(60);
    const end_date = new Date();
    end_date.setDate(end_date.getDate() + 30);
    const dateStr_end = date_stringify(end_date);
    const [endDate, setEndDate] = useState(dateStr_end);
    const [repeatEvery, setRepeatEvery] = useState(7);

    const { setReload } = useContext(reloadContext);
    const { setWindow } = useContext(windowContext);

    const addEvent = async () => {
        try {
            await axios.post("http://localhost:5000/api/scheduled-events/create", { name: eventName, description: eventDescription, start_date: startDate, start_at: startAt, duration: duration, end_date: endDate, repeat_every: repeatEvery })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div style={form_content_container_style}>
            <h1>Add event</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="event-name">Event Name</label>
                        </td>
                        <td>
                            <input type="text" id="event-name" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event Name" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="event-description">Event Description</label>
                        </td>
                        <td>
                            <textarea id="event-description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Event Description" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="start-date">Start Date</label>
                        </td>
                        <td>
                            <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="start-at">Start At</label>
                        </td>
                        <td>
                            <input type="time" id="start-at" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="duration">Duration</label>
                        </td>
                        <td>
                            <input type="number" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="end-date">End Date</label>
                        </td>
                        <td>
                            <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="repeat-every">Repeat Every</label>
                        </td>
                        <td>
                            <input type="number" id="repeat-every" value={repeatEvery} onChange={(e) => setRepeatEvery(e.target.value)} />
                        </td>
                    </tr>
                </tbody>
            </table>

            {eventName != '' && eventDescription != '' && duration > 0 && repeatEvery > 0 ? <button onClick={addEvent}>Add Event</button> : <button disabled>Add Event</button>}
        </div>
    );
}

export default AddEvent;