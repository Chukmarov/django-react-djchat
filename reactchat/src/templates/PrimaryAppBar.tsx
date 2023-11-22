import {
  AppBar,
  Toolbar,
  Link,
  Typography,
  Box,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";

const PrimaryAppBar = () => {
  /* sideMenu, setSiteMenu - это деструктуризация массива, 
  При это sideMenu это переменнаяБ флаг, а setSideMenu -
  это функция, которая присваивает sideMenu значения
  True или False */
  const [sideMenu, setSideMenu] = useState(false);
  /* Здесь мы применяем тему
  Общую для всего приложения */
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  /* 
  Тут мы смотрим на размеры экрана и закрвыаем боковое меню, если экран более 600 px. 
  обрати внимание на завимисость имею ввиде isSmallScreen в последней части выражения
  оно говорит о том что усвловия будет вклчаться как только сработает isSmallScreem  
   */  
  useEffect(()=>{
    if (isSmallScreen && sideMenu)
    setSideMenu(false);
  },[isSmallScreen])

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      // Если событие является клавишей Tab или Shift, игнорируем его
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      // В противном случае устанавливаем новое значение sideMenu
      setSideMenu(open);
    };

  return (
    // в toolbar мы импортируем тему, которую ранее создали
    <AppBar
      sx={{
        /* Ниже мы сбрасываем цвет верхнего меню до белого цвета, а
            также настраиваем цвет нижней границы */
        zIndex: (theme) => theme.zIndex.drawer + 2,
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          height: theme.primaryAppBar.height,
          minHeight: theme.primaryAppBar.height,
        }}
      >
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <IconButton
            onClick={toggleDrawer(true)}
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Drawer anchor="left" open={sideMenu} onClose={toggleDrawer(false)}>
          {[...Array(10)].map((_, i) => (
            <Typography key={i} paragraph>
              {i + 1}
            </Typography>
          ))}
        </Drawer>

        {/* 
          Ниже мы настраиваем логотип как ссылку саму на себя
          Также прописываем размер шрифта, не забудьте импортировать
          компоненты Link и Typography
        */}
        <Link href="/" underline="none" color="inherit">
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: {
                fontWeight: 700,
                letterSpacing: "-0,5px",
              },
            }}
          >
            DJCHAT
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};
export default PrimaryAppBar;
