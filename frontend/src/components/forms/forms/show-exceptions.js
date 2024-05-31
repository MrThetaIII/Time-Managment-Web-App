import { form_content_container_style } from "./form-content-styles";
import { useContext } from "react";
import { tasksContext, reloadContext, windowContext } from "../../../App";
import axios from "axios";

function ShowExceptions() {
    const { exceptions } = useContext(tasksContext);
    const { setReload } = useContext(reloadContext);
    const { setWindow } = useContext(windowContext);
    const deletException = async (id) => {
        try {
            await axios.put("http://localhost:5000/api/exceptions/delete", { id: id })
            setReload(prev => !prev)
            setWindow('idle');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div style={{ ...form_content_container_style, justifyContent: 'space-around' }}>
            <h1>Exceptions</h1>
            <table>
                <tbody>
                    {exceptions.map(exception => (
                        <tr key={exception.id}>
                            <td>
                                <p>{exception.event_name}</p>
                            </td>
                            <td>
                                <p>{(new Date(exception.date)).toLocaleDateString()}</p>
                            </td>
                            <td>
                                <button onClick={() => deletException(exception.id)} style={{ backgroundColor: '#F98576' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ShowExceptions;