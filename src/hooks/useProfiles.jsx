import { useEffect, useState } from "react";
import api from "../api";

export default function useProfiles() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    async function fetchProfiles() {
      const response = await api.get("/api/profile");
      if (response?.status === 200) {
        setProfiles(response?.data);
      }
    }

    fetchProfiles();
  }, []);
  return { profiles };
}
