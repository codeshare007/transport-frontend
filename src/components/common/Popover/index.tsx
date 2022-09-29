import React, { ReactNode } from 'react';
import { StyledPopper, StyledInside } from './Popover.styled'
import { Fade, Box } from '@mui/material';

interface NotificationProps {
  id: any;
  open: boolean;
  anchorEl: HTMLElement | null;
  children?: ReactNode;
}

const NotificationPopup = (props: NotificationProps) => {
  const { id, open, anchorEl, children } = props;

  return (
    <StyledPopper
    sx={{width: {xs:"100%", md:"333px"}, paddingTop: "18px", paddingRight: "2px", height: {xs:"100%", md:"372px"}}}
      id={id}
      open={open}
      anchorEl={anchorEl}
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <StyledInside>
            {children}
          </StyledInside>
        </Fade>
      )}
    </StyledPopper>
  )
};

export default NotificationPopup;
