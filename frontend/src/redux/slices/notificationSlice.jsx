import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notif_Count: 0,
        rel_Count: 0,
        seen: false,
        allAlerts: {}, // as object now
        allNotifs: {},
        allFilteredNotifs: {},
    },
    reducers: {
        setNotifCount: (state, action) => {
            state.notif_Count = action.payload;
        },
        setRelCount: (state, action) => {
            state.rel_Count = action.payload;
        },
        incrementNotifCount: (state, action) => {
            state.notif_Count += action.payload;
        },
        clearNotifCount: (state) => {
            state.notif_Count = 0;
        },
        setSeen: (state, action) => {
            state.seen = action.payload;
        },

        // replaces entire alerts object
        setAllAlerts: (state, action) => {
            if (Array.isArray(action.payload)) {
                action.payload.forEach(alert => {
                    state.allAlerts[alert.alert_id] = alert;
                });
            } else if (typeof action.payload === 'object' && action.payload !== null) {
                state.allAlerts = action.payload;
            }
        },

        appendAllAlerts: (state, action) => {
            const newAlerts = action.payload;
            if (Array.isArray(newAlerts)) {
                newAlerts.forEach(alert => {
                    state.allAlerts[alert.alert_id] = alert;
                });
            } else {
                Object.entries(newAlerts).forEach(([id, alert]) => {
                    state.allAlerts[id] = alert;
                });
            }
        },
        updateAlertStatus: (state, action) => {
            const { alert_id, resolved_status } = action.payload;
            const alertKey = Object.keys(state.allAlerts).find(
                key => state.allAlerts[key].alert_id === alert_id
            );
            if (alertKey) {
                state.allAlerts[alertKey].resolved_status = resolved_status;
            }

        },
        setAllNotifs: (state, action) => {
            if (Array.isArray(action.payload)) {
                action.payload.forEach(notif => {
                    state.allNotifs[notif.notification_id] = notif;
                });
            } else if (typeof action.payload === 'object' && action.payload !== null) {
                state.allNotifs = action.payload;
            }
        },
        appendAllNotifs: (state, action) => {
            const newNotifs = action.payload;
            if (Array.isArray(newNotifs)) {
                newNotifs.forEach(notif => {
                    state.allNotifs[notif.notification_id] = notif;
                });
            } else {
                state.allNotifs[newNotifs.notification_id] = newNotifs;
            }
        },
        updateAllNotifs: (state, action) => {
            const { id, replyText, replyDate } = action.payload;
            state.allNotifs[id].replytext = replyText;
            state.allNotifs[id].replydate = replyDate;
            state.allNotifs[id].replied = true;
        },
        deleteNotif: (state, action) => {
            const { id } = action.payload;

            if (!state.allNotifs[id].is_read) {
                state.notif_Count = state.notif_Count - 1;
            }
            if (state.allNotifs[id]) {
                delete state.allNotifs[id];
            }

            if (state.allFilteredNotifs[id]) {
                delete state.allFilteredNotifs[id];
            }
        },
        updateRead: (state, action) => {
            const { id } = action.payload;

            if (state.allNotifs[id]) {
                state.allNotifs[id].is_read = true;
                state.notif_Count = Math.max(0, state.notif_Count - 1);
            }

            if (state.allFilteredNotifs[id]) {
                delete state.allFilteredNotifs[id];
            }
        },
        updateReadMany: (state, action) => {
            const ids = action.payload;

            ids.forEach(id => {
                if (state.allNotifs[id]) {
                    state.allNotifs[id].is_read = true;
                    state.notif_Count = Math.max(0, state.notif_Count - 1);
                }

                if (state.allFilteredNotifs[id]) {
                    delete state.allFilteredNotifs[id];
                }
            });
        },
        setAllFilteredNotifs: (state, action) => {
            if (Array.isArray(action.payload)) {
                // console.log("here")
                action.payload.forEach(notif => {
                    state.allFilteredNotifs[notif.notification_id] = notif;
                });
            } else if (typeof action.payload === 'object' && action.payload !== null) {
                state.allFilteredNotifs = action.payload;
            }
        },
        appendFilteredNotifs: (state, action) => {
            const newNotifs = action.payload;
            if (Array.isArray(newNotifs)) {
                newNotifs.forEach(notif => {
                    state.allFilteredNotifs[notif.notification_id] = notif;
                });
            } else {
                state.allFilteredNotifs[newNotifs.notification_id] = newNotifs;
            }
        }
        // updateAlertStatus: (state, action) => {
        //     const { alert_id, resolved_status } = action.payload;
        //     const alertKey = Object.keys(state.allAlerts).find(
        //         key => state.allAlerts[key].alert_id === alert_id
        //     );
        //     if (alertKey) {
        //         state.allAlerts[alertKey].resolved_status = resolved_status;
        //     }
        // },
    },
});

export const {
    setNotifCount,
    setRelCount,
    incrementNotifCount,
    clearNotifCount,
    setSeen,
    setAllAlerts,
    appendAllAlerts,
    deleteNotif,
    updateAlertStatus,
    setAllNotifs,
    appendAllNotifs,
    updateAllNotifs,
    updateRead,
    updateReadMany,
    setAllFilteredNotifs,
    appendFilteredNotifs
} = notificationSlice.actions;

export default notificationSlice.reducer;
