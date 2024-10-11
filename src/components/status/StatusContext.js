import { createContext } from 'react';

const StatusContext = createContext({
    appStatus: null,
    setAppStatus: () => {},
});

export default StatusContext;