import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Link, NavLink } from 'react-router-dom';
import RabitSvgIcon from '@rabit/core/RabitSvgIcon';
import { selectUser } from 'app/store/userSlice';
import { Paper } from '@mui/material';

function UserMenu(props) {
  const user = useSelector(selectUser);

  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  return (
    <>
      <Paper
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
        color="inherit"
        sx={{display:"flex",
          boxShadow:"none",
          cursor:"pointer",
          color:"white",
          backgroundColor:"transparent"
        }}
      >
      
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {user?.data?.displayName}
          </Typography>
          <Typography className="text-11 font-medium capitalize" color="white">
            {user?.role?.toString()}
            {(!user?.role || (Array.isArray(user?.role) && user?.role?.length === 0)) && 'Guest'}
          </Typography>
        </div>

        {user.data.photoURL ? (
          <Avatar className="md:mx-4" alt="user photo" src={user.data.photoURL} />
        ) : (
          <Avatar className="md:mx-4">{user?.data?.displayName}</Avatar>
        )}
      </Paper>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        {user?.role =='guest' || user?.role?.length === 0 ? (
          <>
            <MenuItem component={Link} to="/sign-in" role="button">
              <ListItemIcon className="min-w-40">
                <RabitSvgIcon>heroicons-outline:lock-closed</RabitSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </MenuItem>
            {/* <MenuItem component={Link} to="/sign-up" role="button">
              <ListItemIcon className="min-w-40">
                <RabitSvgIcon>heroicons-outline:user-add </RabitSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </MenuItem> */}
          </>
        ) : (
          <>
            <MenuItem component={Link} to="/user/profile" onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <RabitSvgIcon>heroicons-outline:user-circle</RabitSvgIcon>
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>
            <MenuItem
              component={NavLink}
              to="/sign-out"
              onClick={() => {
                userMenuClose();
              }}
            >
              <ListItemIcon className="min-w-40">
                <RabitSvgIcon>heroicons-outline:logout</RabitSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </MenuItem>
          </>
        )}
      </Popover>
    </>
  );
}

export default UserMenu;
