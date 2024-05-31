import theme from '../../themes/blue';

export const date_style = {
    width: '350px',
    height: '50px',
    fontSize: '1.7em',
    backgroundColor: theme.primary_dark,
    color: theme.secondary_light,
    outerWidth: 'none',
    border: 'none',
    borderRadius: '10px',
    padding: '10px',
    boxSizing: 'border-box',
}

export const task_button_style = hover => ({
    width: '230px',
    height: '50px',
    flexShrink: '0',
    fontSize: '1.7em',
    transition: 'all 0.4s ease-in-out',
    backgroundColor: hover ? theme.secondary_dark : theme.primary_dark,
    color: hover ? theme.primary_dark : theme.secondary_light,
    border: hover ? `3px solid ${theme.primary_dark}` : 'none',
    outerWidth: 'none',
    borderRadius: '10px',
    padding: '10px',
    boxSizing: 'border-box',
})

export const scheduled_button_style = hover => ({
    width: '350px',
    height: '50px',
    flexShrink: '0',
    fontSize: '1.7em',
    transition: 'all 0.4s ease-in-out',
    backgroundColor: hover ? theme.tertiary_dark : theme.primary_dark,
    color: hover ? theme.primary_light : theme.secondary_light,
    border: hover ? `3px solid ${theme.primary_light}` : 'none',
    outerWidth: 'none',
    borderRadius: '10px',
    padding: '10px',
    boxSizing: 'border-box',
})

export const exception_button_style = hover => ({
    width: '250px',
    height: '50px',
    flexShrink: '0',
    fontSize: '1.7em',
    transition: 'all 0.4s ease-in-out',
    backgroundColor: hover ? theme.gray_dark : theme.primary_dark,
    color: hover ? theme.gray_light : theme.secondary_light,
    border: hover ? `3px solid ${theme.gray_light}` : 'none',
    outerWidth: 'none',
    borderRadius: '10px',
    padding: '10px',
    boxSizing: 'border-box',
})

export const control_styles = {
    backgroundColor: theme.secondary_light,
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
}

export const info_styles = {
    backgroundColor: theme.primary_dark,
    height: '90px',
    width: '300px',
    borderRadius: '10px',
    fontSize: '1.2em',
    textAlign: 'left',
    flexShrink: '0',
    color: theme.secondary_light,
    padding: '10px',
    boxSizing: 'border-box',
    display: 'inline',
}