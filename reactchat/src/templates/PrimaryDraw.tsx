import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery, Typography, styled } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import DrawerToggle from "../components/PrimaryDraw/DrawToggle";
import MuiDrawer from "@mui/material/Drawer";
import React from "react";

/* 
Здесь определен тип Props, который представляет собой объект с 
единственным свойством children, тип которого ReactNode. ReactNode -
это общий тип для элементов React, который может представлять текст,
компоненты или фрагменты. */
type Props = {
  children: ReactNode;
};

/* 
Этот тип ChildProps определяет свойство open с типом Boolean.
Это будет использоваться в дочерних компонентах.
*/
type ChildProps = {
  open: Boolean;
};

/* 
Тип ChildElement представляет собой React-элемент, который ожидает
дочерние компоненты с свойствами, соответствующими ChildProps.
*/
type ChildElement = React.ReactElement<ChildProps>;

const PrimaryDraw: React.FC<Props> = ({ children }) => {
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
        </Box>
        {/* 
        React.Children.map(children, (child) => { ... }):
        Это итерирует по каждому дочернему элементу, переданному в компонент PrimaryDraw.

        React.isValidElement(child):
        Эта проверка определяет, является ли текущий дочерний элемент (child) допустимым элементом React.
        React.cloneElement(child as ChildElement, { open }):

        Если child является допустимым элементом React, то происходит клонирование этого элемента с использованием React.cloneElement.
        Второй аргумент { open } представляет собой новые свойства, которые передаются клонированному элементу.
        Предположительно, open передается в качестве свойства в дочерние компоненты.
        else: child;:

        Если child не является допустимым элементом React, то просто возвращается оригинальный child.
        Таким образом, этот код пробегает через все дочерние элементы, переданные в компонент PrimaryDraw. Если элемент является допустимым элементом React, то он клонируется с новым свойством open. Если элемент не является допустимым элементом React, он остается без изменений. Это может быть использовано для передачи дополнительных свойств или обработки дочерних элементов вложенных компонентов.
        */}
        {React.Children.map(children, (child) => {
          return React.isValidElement(child)
            ? React.cloneElement(child as ChildElement, { open })
            : child;
        })}
      </Box>
    </Drawer>
  );
};
export default PrimaryDraw;
