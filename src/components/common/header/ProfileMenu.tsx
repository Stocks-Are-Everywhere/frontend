import React, { useState } from "react";
import { Menu, MenuItem, Avatar, IconButton } from "@mui/material";
import AuthService from "../../../services/AuthService";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

const ProfileMenu: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleProfile = () => {
        handleClose();
        navigate("/personal");
    };

    const handleLogout = () => {
        AuthService.logoutGoogle();
        handleClose();
    };

    return (
        <>
        <UserProfile>
            
            <IconButton onClick={handleClick}>
                <ProfileImage src="/images/default-profile.png" />
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleProfile}>프로필</MenuItem>
                <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
            </Menu>

        </UserProfile>
        </>
    );
};

const UserProfile = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f2f2f2;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default ProfileMenu;
