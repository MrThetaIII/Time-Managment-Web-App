import { useContext, useState } from "react";
import { dateContext, windowContext, infoContext } from "../App"
import { date_style, task_button_style, scheduled_button_style, exception_button_style, control_styles, info_styles } from "./controls/controls_styles";

function Controls() {
    const { day, setDay } = useContext(dateContext);
    const { setWindow } = useContext(windowContext);

    const [hoverT, setHoverT] = useState(false);
    const [hoverS, setHoverS] = useState(false);
    const [hoverE, setHoverE] = useState(false);

    const { info } = useContext(infoContext);

    const handle_date_change = (event) => {
        setDay(event.target.value)
    }

    return (
        <div style={control_styles}>
            <input type='date' value={day} onChange={handle_date_change} style={date_style} />
            <button
                onClick={() => setWindow('Add Task')}
                style={task_button_style(hoverT)}
                onMouseEnter={() => setHoverT(true)}
                onMouseLeave={() => setHoverT(false)}
            >
                Add Task
            </button>
            <button
                onClick={() => setWindow('Show Exceptions')}
                style={exception_button_style(hoverE)}
                onMouseEnter={() => setHoverE(true)}
                onMouseLeave={() => setHoverE(false)}
            >
                Show Exceptions
            </button>

            <button
                onClick={() => setWindow('Add Event')}
                style={scheduled_button_style(hoverS)}
                onMouseEnter={() => setHoverS(true)}
                onMouseLeave={() => setHoverS(false)}
            >
                Add Scheduled Event
            </button>
            <div style={info_styles}>
                {info.lastingFor > 0 ?
                    (<>
                        Starting at: {info.startingAt.slice(0, 5)} <br />
                        Lasting For: {info.lastingFor} minutes <br />
                        State: {info.state}
                    </>)
                    : <p>Hover to show info</p>
                }
            </div>
        </div>
    );
}

export default Controls;