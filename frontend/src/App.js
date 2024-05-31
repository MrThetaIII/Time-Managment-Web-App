import "./App.css";
import Controls from "./components/controls";
import theme from "./themes/blue";
import TimeLine from "./components/time-line";
import { createContext, useState, useEffect, useCallback } from "react";
import FormWindow from "./components/forms/form";
import { getTasks } from "./utility/tasks_manipulation";

export const dateContext = createContext();
export const windowContext = createContext();
export const tasksContext = createContext();
export const taskIDContext = createContext();
export const reloadContext = createContext();
export const infoContext = createContext();

function App() {
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);
  const getDay = useCallback(() => day, [day]);
  const [window, setWindow] = useState('idle');
  const [taskID, setTaskID] = useState(0);
  const [reload, setReload] = useState(false);
  const [info, setInfo] = useState({ startingAt: '', lastingFor: 0, state: '' });

  const [tasks, setTasks] = useState([]);
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assignmentExtensions, setAssignmentExtensions] = useState([]);
  const [taskExtensions, setTaskExtensions] = useState([]);
  const [exceptions, setExceptions] = useState([]);

  const finalize = (all) => {
    setTasks(all.tasks);
    setScheduledEvents(all.scheduledEvents);
    setAssignments(all.assignments);
    setAssignmentExtensions(all.assignmentExtensions);
    setTaskExtensions(all.taskExtensions);
    setExceptions(all.exceptions);
  }

  useEffect(() => {
    getTasks(getDay(), finalize);
  }, [getDay, reload]);


  return (
    <div className="App" style={{ backgroundColor: theme.gray_dark }}>
      <dateContext.Provider value={{ day, setDay }}>
        <windowContext.Provider value={{ window, setWindow }}>
          <tasksContext.Provider
            value={{
              tasks,
              scheduledEvents,
              assignments,
              assignmentExtensions,
              taskExtensions,
              exceptions,
            }}
          >
            <taskIDContext.Provider value={{ taskID, setTaskID }}>
              <reloadContext.Provider value={{ reload, setReload }}>
                <infoContext.Provider value={{ info, setInfo }}>
                  {window !== 'idle' && <FormWindow />}
                  <Controls />
                  <TimeLine />
                </infoContext.Provider>
              </reloadContext.Provider>
            </taskIDContext.Provider>
          </tasksContext.Provider>
        </windowContext.Provider>
      </dateContext.Provider>
    </div>
  );
}

export default App;
