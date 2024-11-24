import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ElectricBolt as ElectricBoltIcon,
  Engineering as EngineeringIcon,
  Security as SecurityIcon,
  Shield as ShieldIcon,
  FlashOn as FlashOnIcon,
  Build as BuildIcon,
} from '@mui/icons-material';
import { useState } from 'react';

const drawerWidth = 240;

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { text: 'Главная', path: '/', icon: <HomeIcon /> },
  { text: 'Расчет токов КЗ', path: '/short-circuit', icon: <ElectricBoltIcon /> },
  { text: 'Выбор оборудования', path: '/equipment', icon: <EngineeringIcon /> },
  { text: 'Заземление', path: '/grounding', icon: <SecurityIcon /> },
  { text: 'Релейная защита', path: '/relay', icon: <ShieldIcon /> },
  { text: 'Молниезащита', path: '/lightning', icon: <FlashOnIcon /> },
  { text: 'Реконструкция ячеек', path: '/reconstruction', icon: <BuildIcon /> },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
            
          return (
            <ListItem
              component="div"
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{ 
                cursor: 'pointer',
                backgroundColor: isActive ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive ? 'action.selected' : 'action.hover'
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiListItemText-primary': {
                    color: isActive ? 'primary.main' : 'inherit',
                    fontWeight: isActive ? 500 : 400
                  }
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Расчеты для электрических подстанций
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
