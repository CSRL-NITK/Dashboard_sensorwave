import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MenuIcon from "@mui/icons-material/Menu";
import {
  ChatOutlined,
  DashboardOutlined,
  DeviceHubOutlined,
  Groups3Outlined,
  HomeOutlined,
  ManageAccounts,
  NotificationsActiveOutlined,
  Report,
  ReportOffOutlined,
  SettingsOutlined
} from '@mui/icons-material';
import { IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { AssignmentOutlined } from '@mui/icons-material';

const LeftBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const theme = useSelector((state) => state.theme.theme);
  const permissions = JSON.parse(sessionStorage.getItem('permissions'));

  // Media queries for responsive sizing
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const isMediumScreen = useMediaQuery('(min-width:1280px) and (max-width:1919px)');
  const isSmallScreen = useMediaQuery('(max-width:1279px)');

  // Auto-collapse on small screens
  useEffect(() => {
    if (isSmallScreen) {
      setCollapsed(true);
    }
  }, [isSmallScreen]);

  const toggleCollapse = () => setCollapsed(!collapsed);

  // Calculate responsive sizes
  const getIconSize = () => {
    if (isLargeScreen) return '28px';
    if (isMediumScreen) return '24px';
    return '20px';
  };

  const getFontSize = () => {
    if (isLargeScreen) return '1.3rem';
    if (isMediumScreen) return '1.1rem';
    return '1rem';
  };

  const getSidebarWidth = () => {
    if (collapsed) {
      return isLargeScreen ? '4.5vw' : isMediumScreen ? '5vw' : '3.5vw';
    }
    return isLargeScreen ? '15vw' : isMediumScreen ? '12vw' : '10vw';
  };

  const getPadding = () => {
    if (isLargeScreen) return '1rem';
    if (isMediumScreen) return '0.75rem';
    return '0.5rem';
  };

  // Tooltip component that only shows when sidebar is collapsed
  const CollapsedTooltip = ({ title, children }) => {
    return collapsed ? (
      <Tooltip title={title} placement="right" arrow>
        {children}
      </Tooltip>
    ) : (
      children
    );
  };

  return (
    <div
      className={`h-full relative transition-all duration-300 ease-in-out box-content
      ${theme === 'light' ? 'bg-blue-200 text-black border-r border-blue-300' : 'bg-gray-900 text-white border-r border-gray-700'}`}
      style={{
        width: getSidebarWidth(),
        fontSize: getFontSize(),
        padding: getPadding(),
        minHeight: '100vh',
      }}
    >
      <div className="flex gap-1 items-center ">
        <CollapsedTooltip title="Toggle Menu">
          <IconButton onClick={toggleCollapse} size={isLargeScreen ? "large" : "medium"}>
            <MenuIcon style={{ fontSize: getIconSize() }} />
          </IconButton>
        </CollapsedTooltip>
        {!collapsed && <span className="font-medium">Menu</span>}
      </div>

      <div className="flex flex-col box-content">
        {permissions.includes('access:home') && <CollapsedTooltip title="Home">
          <Link to="/"
            className={`flex gap-1 items-center  no-underline cursor-pointer border border-transparent
            ${theme === 'light'
                ? 'text-black hover:border-black rounded-md'
                : 'text-white hover:border-white rounded-md'}`}
          >
            <IconButton size={isLargeScreen ? "large" : "medium"}>
              <HomeOutlined
                style={{ fontSize: getIconSize() }}
                className={`${theme === 'light' ? 'text-black' : 'text-white'}`}
              />
            </IconButton>
            {!collapsed && <span>Home</span>}
          </Link>
        </CollapsedTooltip>}

        {permissions.includes('access:dashboard') && <CollapsedTooltip title="Dashboard">
          <Link to="/dashboard"
            className={`flex gap-1 items-center  no-underline cursor-pointer border border-transparent
            ${theme === 'light'
                ? 'text-black hover:border-black rounded-md'
                : 'text-white hover:border-white rounded-md'}`}
          >
            <IconButton size={isLargeScreen ? "large" : "medium"}>
              <DashboardOutlined
                style={{ fontSize: getIconSize() }}
                className={theme === 'light' ? 'text-black' : 'text-white'}
              />
            </IconButton>
            {!collapsed && <span>Dashboard</span>}
          </Link>
        </CollapsedTooltip>}

        {permissions.includes('access:vendors') && (
          <CollapsedTooltip title="Vendors">
            <Link to="/vendors"
              className={`flex gap-1 items-center  no-underline cursor-pointer border border-transparent
              ${theme === 'light'
                  ? 'text-black hover:border-black rounded-md'
                  : 'text-white hover:border-white rounded-md'}`}
            >
              <IconButton size={isLargeScreen ? "large" : "medium"}>
                <ManageAccounts
                  style={{ fontSize: getIconSize() }}
                  className={theme === 'light' ? 'text-black' : 'text-white'}
                />
              </IconButton>
              {!collapsed && <span>Vendors</span>}
            </Link>
          </CollapsedTooltip>
        )}

        {permissions.includes('access:devices') && (
          <CollapsedTooltip title="Devices">
            <Link to="/devices"
              className={`flex gap-1 items-center  no-underline cursor-pointer border border-transparent
              ${theme === 'light'
                  ? 'text-black hover:border-black rounded-md'
                  : 'text-white hover:border-white rounded-md'}`}
            >
              <IconButton size={isLargeScreen ? "large" : "medium"}>
                <DeviceHubOutlined
                  style={{ fontSize: getIconSize() }}
                  className={theme === 'light' ? 'text-black' : 'text-white'}
                />
              </IconButton>
              {!collapsed && <span>Devices</span>}
            </Link>
          </CollapsedTooltip>
        )}

        {permissions.includes('access:customers') && (
          <CollapsedTooltip title="Customers">
            <Link to="/customers"
              className={`flex gap-1 items-center  no-underline cursor-pointer border border-transparent
            ${theme === 'light'
                  ? 'text-black hover:border-black rounded-md'
                  : 'text-white hover:border-white rounded-md'}`}
            >
              <IconButton size={isLargeScreen ? "large" : "medium"}>
                <Groups3Outlined
                  style={{ fontSize: getIconSize() }}
                  className={theme === 'light' ? 'text-black' : 'text-white'}
                />
              </IconButton>
              {!collapsed && <span>Customers</span>}
            </Link>
          </CollapsedTooltip>
        )}

        {permissions.includes('access:alerts') && <CollapsedTooltip title="Alerts">
          <Link to="/alerts"
            className={`flex gap-1 items-center  no-underline cursor-pointer border border-transparent
            ${theme === 'light'
                ? 'text-black hover:border-black rounded-md'
                : 'text-white hover:border-white rounded-md'}`}
          >
            <IconButton size={isLargeScreen ? "large" : "medium"}>
              <NotificationsActiveOutlined
                style={{ fontSize: getIconSize() }}
                className={theme === 'light' ? 'text-black' : 'text-white'}
              />
            </IconButton>
            {!collapsed && <span>Alerts</span>}
          </Link>
        </CollapsedTooltip>}

        {/* {vendor && <CollapsedTooltip title="Settings">
          <Link to="/settings"
            className={`flex gap-1 items-center  no-underline cursor-pointer border border-transparent
              ${theme === 'light'
                ? 'text-black hover:border-black rounded-md'
                : 'text-white hover:border-white rounded-md'}`}
          >
            <IconButton size={isLargeScreen ? "large" : "medium"}>
              <SettingsOutlined
                style={{ fontSize: getIconSize() }}
                className={theme === 'light' ? 'text-black' : 'text-white'}
              />
            </IconButton>
            {!collapsed && <span>Settings</span>}
          </Link>
        </CollapsedTooltip>} */}
        {permissions.includes('access:notifications') && <CollapsedTooltip title="Notifications">
          <Link to="/notifications"
            className={`flex gap-1 items-center  no-underline cursor-pointer border border-transparent
            ${theme === 'light'
                ? 'text-black hover:border-black rounded-md'
                : 'text-white hover:border-white rounded-md'}`}
          >
            <IconButton size={isLargeScreen ? "large" : "medium"}>
              <ChatOutlined
                style={{ fontSize: getIconSize() }}
                className={theme === 'light' ? 'text-black' : 'text-white'}
              />
            </IconButton>
            {!collapsed && <span>Notifications</span>}
          </Link>
        </CollapsedTooltip>}
        {permissions.includes('access:reports') && <CollapsedTooltip title="Reports">
          <Link to="/reports"
            className={`flex gap-1 items-center  no-underline cursor-pointer border border-transparent
            ${theme === 'light'
                ? 'text-black hover:border-black rounded-md'
                : 'text-white hover:border-white rounded-md'}`}
          >
            <IconButton size={isLargeScreen ? "large" : "medium"}>
              <AssignmentOutlined
                style={{ fontSize: getIconSize() }}
                className={theme === 'light' ? 'text-black' : 'text-white'}
              />
            </IconButton>
            {!collapsed && <span>Reports</span>}
          </Link>
        </CollapsedTooltip>}

      </div>
    </div>
  );
};

export default LeftBar;