import React, { useState } from 'react';
import { Box, IconButton, InputBase, Typography, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
    DarkModeOutlined as DarkModeOutlinedIcon,
    LightModeOutlined as LightModeOutlinedIcon,
    NotificationsOutlined as NotificationsOutlinedIcon,
    PersonOutlined as PersonOutlinedIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { toggleTheme } from '../redux/slices/themeSlice';
import CSRL_logo from '../assets/CSRL.svg';
import { useAuth0 } from "@auth0/auth0-react";
import { setSeen } from '../redux/slices/notificationSlice';
import ProfileModal from '../modals/ProfileModal';
import Notification from '../modals/Notification';

export default function Topbar() {
    const { isAuthenticated } = useAuth0();
    const seen = useSelector((state) => state.notification.seen);
    const theme = useSelector((state) => state.theme.theme);
    const notif_Count = useSelector((state) => state.notification.notif_Count);
    const rel_Count = useSelector((state) => state.notification.rel_Count);
    const dispatch = useDispatch();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    // Media queries for responsive sizing
    const isLargeScreen = useMediaQuery('(min-width:1920px)');
    const isMediumScreen = useMediaQuery('(min-width:1280px) and (max-width:1919px)');
    const isSmallScreen = useMediaQuery('(max-width:1279px)');

    const colors = {
        TopBar: theme === 'light' ? {
            backgroundColor: 'skyblue',
            searchBar: '#f0f0f0',
            color: '#000',
        } : {
            backgroundColor: '#222',
            searchBar: '#333',
            color: '#ddd',
        },
    };

    // Responsive sizing variables
    const topbarHeight = isLargeScreen ? '12vh' : isMediumScreen ? '10vh' : '9vh';
    const logoSize = isLargeScreen ? '8vh' : isMediumScreen ? '18vh' : '8vh';
    const titleFontSize = isLargeScreen ? '36px' : isMediumScreen ? '32px' : '24px';
    const searchWidth = isLargeScreen ? '400px' : isMediumScreen ? '300px' : '240px';
    const searchHeight = isLargeScreen ? '40px' : isMediumScreen ? '35px' : '30px';
    const iconSize = isLargeScreen ? 'large' : isMediumScreen ? 'medium' : 'small';
    const paddingValue = isLargeScreen ? 2 : isMediumScreen ? 1.5 : 1;

    function ToggleProfile() {
        if (isAuthenticated) {
            setProfileOpen(!profileOpen);
            setNotificationOpen(false);
        }
    }

    function ToggleNotification() {
        setNotificationOpen(!notificationOpen);
        setProfileOpen(false);
    }
    function handleNotifClose(){
        setNotificationOpen(false);
        dispatch(setSeen(false));
        // dispatch(setRelCount(notif_Count));
    }

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={paddingValue}
            sx={{
                height: topbarHeight,
                position: "sticky",
                minHeight: '60px',
                maxHeight: '120px',
                borderBottom: `1px solid ${theme === 'light' ? 'skyblue' : '#444'}`,
                transition: 'all 0.3s ease',
            }}
            className={`${theme === 'light' ? 'bg-blue-200 text-black' : 'bg-gray-900 text-white'}`}
        >
            <Box display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
                <img
                    src={CSRL_logo}
                    alt="logo"
                    style={{
                        height: logoSize,
                        width: 'auto',
                        maxWidth: logoSize,
                        filter: theme === 'dark' ? 'invert(1)' : 'none',
                        marginRight: '8px',
                    }}
                />
                <Typography
                    fontFamily="Orbitron"
                    fontWeight="500"
                    fontSize={titleFontSize}
                    color={colors.TopBar.color}
                    sx={{
                        whiteSpace: 'nowrap',
                        transition: 'font-size 0.3s ease',
                    }}
                >
                    <span style={{ background: 'linear-gradient(to right, #ff7e5f, #feb47b)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                        Sensor
                    </span>
                    <span style={{ background: 'linear-gradient(to right, #6a11cb, #2575fc)', WebkitBackgroundClip: 'text', color: 'transparent', marginLeft: '5px' }}>
                        Wave
                    </span>
                    {/* SensorWave */}
                </Typography>
            </Box>

            {/* <Box
                display="flex"
                borderRadius="5px"
                sx={{
                    background: colors.TopBar.searchBar,
                    width: searchWidth,
                    height: searchHeight,
                    transition: 'all 0.3s ease',
                    flexGrow: 0,
                    flexShrink: 1,
                    mx: isSmallScreen ? 2 : 4,
                }}
            >
                <InputBase 
                    sx={{ 
                        ml: 1, 
                        flex: 1, 
                        color: colors.TopBar.color,
                        fontSize: isLargeScreen ? '1.1rem' : isMediumScreen ? '1rem' : '0.9rem',
                    }} 
                    placeholder="Search" 
                />
                <IconButton type="button" sx={{ p: isLargeScreen ? 1 : 0.5 }}>
                    <SearchIcon fontSize={iconSize} />
                </IconButton>
            </Box> */}

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: searchHeight,
                    flexShrink: 0,
                }}
            >
                <IconButton onClick={() => dispatch(toggleTheme())} size={iconSize}>
                    {theme === 'dark' ? (
                        <DarkModeOutlinedIcon fontSize={iconSize} />
                    ) : (
                        <LightModeOutlinedIcon fontSize={iconSize} />
                    )}
                </IconButton>

                <IconButton
                    sx={{
                        position: 'relative',
                        mx: isLargeScreen ? 1 : 0.5,
                    }}
                    onClick={() => ToggleNotification()}
                    size={iconSize}
                >
                    {!seen && ((notif_Count - rel_Count) > 0) && (
                        <div style={{
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '50%',
                            padding: isLargeScreen ? '2px 6px' : '0px 4px',
                            fontSize: isLargeScreen ? '12px' : '10px',
                            position: 'absolute',
                            top: 3,
                            right: 4,
                            fontWeight: '1000'
                        }}>
                            {notif_Count-rel_Count}
                        </div>
                    )}
                    <NotificationsOutlinedIcon fontSize={iconSize} />
                </IconButton>

                <IconButton
                    onClick={() => ToggleProfile()}
                    size={iconSize}
                >
                    <PersonOutlinedIcon fontSize={iconSize} />
                </IconButton>
            </Box>

            <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
            <Notification isOpen={notificationOpen} onClose={handleNotifClose} />
        </Box>
    );
}