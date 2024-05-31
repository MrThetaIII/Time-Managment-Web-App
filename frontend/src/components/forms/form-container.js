import { form_window_container_style, form_window_header_style, form_window_style, exit_button_style } from "./form-styles";
import { useContext } from 'react';
import { windowContext } from "../../App";
import AddTask from "./forms/add-task";
import AddAssignment from "./forms/add-assignment";
import AddEvent from "./forms/add-event";
import ExtendAssignment from "./forms/extend-assignment";
import ExtendTask from "./forms/extend-task";
import ModifyAssignment from "./forms/modify-assignment";
import ModifyTask from "./forms/modify-task";
import ModifyEvent from "./forms/modify-event";
import ModifyAssignmentExtension from "./forms/modify-assignment-extension";
import ModifyTaskExtension from "./forms/modify-task-extension";
import ShowExceptions from "./forms/show-exceptions";
import './forms/form-content-styles.css'

function FormContainer() {
    const { window, setWindow } = useContext(windowContext);
    const closeForm = () => {
        setWindow('idle');
    }

    return (
        <div style={form_window_container_style} className='has_vertical_scrollbar'>
            <div style={form_window_style} className='has_vertical_scrollbar'>
                <div style={form_window_header_style}>
                    <span>{window}</span>
                    <div style={exit_button_style} onClick={closeForm} />
                </div>
                {
                    window === 'Add Task' ? <AddTask /> : <></>
                }
                {
                    window === 'Add Assignment' ? <AddAssignment /> : <></>
                }
                {
                    window === 'Add Event' ? <AddEvent /> : <></>
                }
                {
                    window === 'Extend Assignment' ? <ExtendAssignment /> : <></>
                }
                {
                    window === 'Extend Task' ? <ExtendTask /> : <></>
                }
                {
                    window === 'Modify Assignment' ? <ModifyAssignment /> : <></>
                }
                {
                    window === 'Modify Task' ? <ModifyTask /> : <></>
                }
                {
                    window === 'Modify Event' ? <ModifyEvent /> : <></>
                }
                {
                    window === 'Modify Assignment Extension' ? <ModifyAssignmentExtension /> : <></>
                }
                {
                    window === 'Modify Task Extension' ? <ModifyTaskExtension /> : <></>
                }
                {
                    window === 'Show Exceptions' ? <ShowExceptions /> : <></>
                }
            </div>
        </div>
    );
}

export default FormContainer;