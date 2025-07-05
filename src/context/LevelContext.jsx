import { createContext, useContext, useState } from "react";

const LevelContext = createContext();


export default function LevelProvider({ children }) {
    const [levels, setLevels] = useState([]);
    return (
        <LevelContext.Provider value={{ levels, setLevels }}>
            {children}
        </LevelContext.Provider>
    );
}

export function useLevels() {
    return useContext(LevelContext);
}