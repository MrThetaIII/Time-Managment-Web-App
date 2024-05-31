import FormContainer from "./form-container";
import { form_background_style } from "./form-styles";

function FormWindow() {
    return (<div style={form_background_style}>
        <FormContainer />
    </div>);
}

export default FormWindow;