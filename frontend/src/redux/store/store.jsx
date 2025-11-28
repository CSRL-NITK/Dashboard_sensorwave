import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import themeReducer from '../slices/themeSlice';
import sidebarReducer from '../slices/sidebarSlice';
import rolesReducer from '../slices/roleSlice';
import notificationReducer from '../slices/notificationSlice';
import customerReducer from '../slices/customerSlice';
import vendorReducer from '../slices/vendorSlice';
import deviceReducer from '../slices/deviceSlice';
// Persist configuration for theme
const themePersistConfig = {
    key: 'theme',
    storage,
};
// Persist configuration for sidebar
const sidebarPersistConfig = {
    key: 'sidebar',
    storage,
};

const devicePersistConfig = {
    key: 'device',
    storage,
};

const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);
const persistedSidebarReducer = persistReducer(sidebarPersistConfig, sidebarReducer);
const persistedDeviceReducer = persistReducer(devicePersistConfig, deviceReducer);


export const store = configureStore({
    reducer: {
        theme: persistedThemeReducer,
        sidebar: persistedSidebarReducer,
        roles: rolesReducer,
        notification: notificationReducer,
        customer: customerReducer,
        vendor: vendorReducer,
        device: persistedDeviceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'persist/PAUSE',
                    'persist/REGISTER',
                    'persist/PURGE',
                    'persist/FLUSH',
                ],
                ignoredPaths: ['sidebar'], // Ignoring sidebar state from serializable check
            },
        }),
});

export const persistor = persistStore(store);
