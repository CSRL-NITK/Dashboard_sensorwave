import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const Loading = () => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            flexDirection: 'column',
            gap: '20px',
        }}>
            <CircularProgress size={100} />
            <Typography variant="h6">Loading... Please wait</Typography>
        </Box>
    );
}

export default Loading;
