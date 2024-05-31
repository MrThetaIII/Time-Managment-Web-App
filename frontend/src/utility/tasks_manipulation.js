import axios from "axios";
import config from "../config.json";

export const getTasks = (day, finalize) => {
    const startHour = config.periods.startHour;
    const all = {}
    const call_a = () => {
        axios
            .post("http://localhost:5000/api/assignments/get-for-week", {
                current_date: day,
                starting_hour: startHour,
            })
            .then((data) => Array.from(data.data))
            .then((data) => {
                all.assignments = data;
            })
            .finally(() => { call_b() })
            .catch((err) => {
                console.log(err);
            });
    }
    const call_b = () => {
        axios
            .post("http://localhost:5000/api/tasks/get-for-week", {
                current_date: day,
                starting_hour: startHour,
            })
            .then((data) => Array.from(data.data))
            .then((data) => {
                all.tasks = data;
            })
            .finally(() => { call_c() })
            .catch((err) => {
                console.log(err);
            });
    }
    const call_c = () => {
        axios
            .post("http://localhost:5000/api/scheduled-events/get-for-week", {
                current_date: day,
                starting_hour: startHour,
            })
            .then((data) => Array.from(data.data))
            .then((data) => {
                all.scheduledEvents = data;
            })
            .finally(() => { call_d() })
            .catch((err) => {
                console.log(err);
            });
    }
    const call_d = () => {
        axios
            .post("http://localhost:5000/api/assignment-extensions/get-for-week", {
                current_date: day,
                starting_hour: startHour,
            })
            .then((data) => Array.from(data.data))
            .then((data) => {
                all.assignmentExtensions = data;
            })
            .finally(() => { call_e() })
            .catch((err) => {
                console.log(err);
            });
    }
    const call_e = () => {
        axios
            .post("http://localhost:5000/api/task-extensions/get-for-week", {
                current_date: day,
                starting_hour: startHour,
            })
            .then((data) => Array.from(data.data))
            .then((data) => {
                all.taskExtensions = data;
            })
            .finally(() => { call_f() })
            .catch((err) => {
                console.log(err);
            });
    }
    const call_f = () => {
        axios
            .post("http://localhost:5000/api/exceptions/get-for-week", {
                current_date: day,
                starting_hour: startHour,
            })
            .then((data) => Array.from(data.data))
            .then((data) => {
                all.exceptions = data;
            })
            .finally(() => { finalize(all); })
            .catch((err) => {
                console.log(err);
            });
    }
    call_a();
};


export const isOccupied = async (date, duration) => {
    const startHour = config.periods.startHour
    const this_start = (date.getHours() - startHour) * 60 + date.getMinutes()
    const this_end = this_start + +duration
    const day = (date.getDay() + 1) % 7
    const query_day = date.toISOString().split("T")[0]
    const occupied = new Promise(
        (resolve, reject) => {
            const finalize = (slots) => {
                const valid_slots = Array.from(Object.values(slots).slice(0, -1)).reduce((arr, slot) => { arr.push(...slot); return arr }, []).map(slot => [slot.start, slot.duration, slot.day]).filter(slot => slot[2] === day).map(slot => [slot[0], slot[0] + slot[1]])
                valid_slots.forEach(slot => {
                    if (this_start >= slot[0] && this_start < slot[1]) resolve(true)
                    if (this_end > slot[0] && this_end <= slot[1]) resolve(true)
                    if (this_start <= slot[0] && this_end >= slot[1]) resolve(true)
                });
                resolve(false)
            }
            getTasks(query_day, finalize)
        }
    )
    return await occupied
}

export const isOccupiedExcept = async (date, duration, type, id) => {
    const startHour = config.periods.startHour
    const this_start = (date.getHours() - startHour) * 60 + date.getMinutes()
    const this_end = this_start + +duration
    const day = (date.getDay() + 1) % 7
    const query_day = date.toISOString().split("T")[0]
    const occupied = new Promise(
        (resolve, reject) => {
            const finalize = (slots) => {
                const from_type = slots[type].filter(slot => slot.id !== id).map(slot => [slot.start, slot.duration, slot.day]).filter(slot => slot[2] === day).map(slot => [slot[0], slot[0] + slot[1]])
                const valid_slots = Object.keys(slots).filter(key => key !== type && key !== "exceptions").map(key => slots[key]).reduce((arr, slot) => { arr.push(...slot); return arr }, []).map(slot => [slot.start, slot.duration, slot.day]).filter(slot => slot[2] === day).map(slot => [slot[0], slot[0] + slot[1]])
                valid_slots.push(...from_type)
                valid_slots.forEach(slot => {
                    if (this_start >= slot[0] && this_start < slot[1]) resolve(true)
                    if (this_end > slot[0] && this_end <= slot[1]) resolve(true)
                    if (this_start <= slot[0] && this_end >= slot[1]) resolve(true)
                });
                resolve(false)
            }
            getTasks(query_day, finalize)
        }
    )
    return await occupied
}

export const getLastTaskExtension = async (id) => {
    const last = new Promise(
        (resolve, reject) => {
            axios
                .post("http://localhost:5000/api/tasks/last-extension", {
                    id: id,
                })
                .then((data) => resolve(data.data))
                .catch((err) => {
                    console.log(err);
                });
        }
    )
    return await last
}

export const getLastAssignmentExtension = async (id) => {
    const last = new Promise(
        (resolve, reject) => {
            axios
                .post("http://localhost:5000/api/assignments/last-extension", {
                    id: id,
                })
                .then((data) => resolve(data.data))
                .catch((err) => {
                    console.log(err);
                });
        }
    )
    return await last
}

export const taskHasExtension = async (id) => {
    const last = await getLastTaskExtension(id)
    return last !== null
}

export const assignmentHasExtension = async (id) => {
    const last = await getLastAssignmentExtension(id)
    return last !== null
}

export const taskExtensionHasFurtherExtension = async (id, time) => {
    const last = await getLastTaskExtension(id)
    return last !== null && (new Date(last.time)).getTime() > (new Date(time)).getTime()
}

export const assignmentExtensionHasFurtherExtension = async (id, time) => {
    const last = await getLastAssignmentExtension(id)
    return last !== null && (new Date(last.time)).getTime() > (new Date(time)).getTime()
}