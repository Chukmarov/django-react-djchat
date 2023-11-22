import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import DrawerToggle from "../components/PrimaryDraw/DrawToggle";
import MuiDrawer from "@mui/material/Drawer";

const PrimaryDraw = () => {
  const theme = useTheme();
  const below600 = useMediaQuery("(max-width:599px)");

  /* 
    Добавляем миксины для обработки отображения 
    выдвижного ящика. Смысл в том что нам нужна 
    разная ширина, когда мы вручную открываем-закрываем 
    ящик, через шеврон.   
  */
  const openedMixin = () => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = () => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    width: theme.primaryDraw.closed,
  });

  /* Ниже мы перезагружаем выдвижной ящик
  Т.е убираем все настройки по умолчанию и начинаем 
  прописывать их вручную. Делаем разную ширину если 
  мы нажали на открытие шеврона и другую ширину, когда мы закрыли 
  шеврон */
  const Drawer = styled(
    MuiDrawer,
    {}
  )(({ theme, open }) => ({
    width: theme.primaryDraw.width,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(),
      "& .MuiDrawer-paper": openedMixin(),
    }),
    ...(!open && {
      ...closedMixin(),
      "& .MuiDrawer-paper": closedMixin(),
    }),
  }));

  /*open, setOpen - это деструктуризация массива, 
  При это sideMenu это переменнаяБ флаг, а setSideMenu -
  это функция, которая присваивает sideMenu значения
  True или False*/
  const [open, setOpen] = useState(true);
  /* Тут мы применяем меняем значения верхней функции 
  Смысл прост, если после рендеринга страница менее
  600px то True, если более то False*/
  useEffect(() => {
    setOpen(!below600);
  }, [below600]);

  /* Ниже идут функции для ручного открытия-закрытия 
  Имеется ввиду нажатие на шеврон*/
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      // настройки открытия/закрытия в зависимости от размера экрана
      open={open}
      // это настройки видимости она есть , если размер экрана менее более 600
      // и пропадает если размер экрана мнее 600
      variant={below600 ? "temporary" : "permanent"}
      /* ниже идут настройки видимости
      mt - это отступ от верхней части экрана
      height - это высота скролаб раз мы сделали отступ mt
      то должны и откорректировать высоту отображения
      width - это просто ширина записанная в основной теме */
      PaperProps={{
        sx: {
          mt: `${theme.primaryAppBar.height}px`,
          height: `calc(100vh - ${theme.primaryAppBar.height}px)`,
          width: theme.primaryDraw.width,
        },
      }}
    >
      <Box>
        <Box
          /* Нижняя часть отвечает за расположение 
        иконок внутри объекта. По всем настройкам
        она прижимает их к правой части экрана */
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            p: 0,
            width: open ? "auto" : "100%",
          }}
        >
          {/* DrawerToggle мы прописали в папке
          components, тут мы показываем как и где
          его нужно отобразить */}
          <DrawerToggle
            open={open}
            handleDrawerClose={handleDrawerClose}
            handleDrawerOpen={handleDrawerOpen}
          />
          {/* Тут мы просто заполняем данными, 
          для понимания как они будут отображаться */}
          {[...Array(30)].map((_, i) => (
            <Typography key={i} paragraph>
              {i + 1}
            </Typography>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};
export default PrimaryDraw;
