import theme from '../../themes/blue';

export const form_background_style = {
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    zIndex: 5,
    backgroundColor: `${theme.gray_dark}a5`,
    boxSizing: 'border-box',
}

export const form_window_container_style = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

export const form_window_style = {
    position: 'relative',
    width: '60%',
    height: '75%',
    backgroundColor: theme.white,
    borderRadius: '10px',
    overflowY: 'auto',
}

export const form_window_header_style = {
    position: 'relative',
    width: '100%',
    height: '35px',
    backgroundColor: theme.primary_light,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    padding: '0 10px',
    fontFamily: 'cursive',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: theme.white,
}

export const exit_button_style = {
    backgroundColor: 'red',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
}