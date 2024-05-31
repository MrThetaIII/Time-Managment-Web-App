// import sound from './alarm.mp3'


const notify = (title, body) => {
    const notification = new Notification(title, { body: body })
    notification.onclick = () => {
        notification.close()
    }
}
export default notify