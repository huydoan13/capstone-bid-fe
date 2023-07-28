import { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText, Collapse, ListItemButton, ListItemIcon } from '@mui/material';
//
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { StyledNavItem, StyledNavItemIcon } from './styles';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, items, info, role } = item;

  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const user = JSON.parse(localStorage.getItem('loginUser'));

  if (items && items.length > 0) {
    const matchingSubItems = items.filter(subItem => subItem.role?.includes(user.role));

    if ( role?.includes(user.role) || matchingSubItems.length > 0) {

      return (
        <>
          {/* <ListItemButton onClick={handleClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={title} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton> */}
          <StyledNavItem
            onClick={handleClick}
            sx={{
              '&.active': {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightBold',
              },
            }}
          >
            <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
  
            <ListItemText disableTypography primary={title} />
  
            {open ? <ExpandLess /> : <ExpandMore />}
  
            {info && info}
          </StyledNavItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {items.map((subItem) => (
                <StyledNavItem
                  key={subItem.title}
                  component={RouterLink}
                  to={subItem.path}
                  sx={{
                    '&.active': {
                      color: 'text.primary',
                      bgcolor: 'action.selected',
                      fontWeight: 'fontWeightBold',
                    },
                    pl: 2,
                  }}
                >
                  <StyledNavItemIcon>{subItem.icon && subItem.icon}</StyledNavItemIcon>
  
                  <ListItemText disableTypography primary={subItem.title} />
  
                  {subItem.info && subItem.info}
                </StyledNavItem>
              ))}
            </List>
          </Collapse>
        </>
      );
    }
  }

    if (role?.includes(user.role)) {
      return (
        <StyledNavItem
          component={RouterLink}
          to={path}
          sx={{
            '&.active': {
              color: 'text.primary',
              bgcolor: 'action.selected',
              fontWeight: 'fontWeightBold',
            },
          }}
        >
          <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

          <ListItemText disableTypography primary={title} />

          {info && info}
        </StyledNavItem>
      );
    }
    return null;
}