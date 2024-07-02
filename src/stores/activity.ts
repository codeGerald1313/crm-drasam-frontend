import { defineStore } from "pinia";
import axios from "axios";
import { useAuth } from "./auth";

export const acitivitiesInLive = defineStore("activity", {
  state: () => ({
    activities: [],
    tableData: [],
    notifications: [],
  }),
  actions: {
    async fetchActivities() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard/live-activities`,
          useAuth().headers()
        );
        return response.data;
      } catch (e) {
        console.error(e);
      } finally {
      }
    },

    async fetchTableData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard/assignments-info`,
          useAuth().headers()
        );
        return response.data;
      } catch (e) {
        console.error(e);
      } finally {
      }
    },

    async fetchNotifications() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard/notifications`,
          useAuth().headers()
        );
        return response.data;
      } catch (e) {
        console.error(e);
      } finally {
      }
    },
  },
});
