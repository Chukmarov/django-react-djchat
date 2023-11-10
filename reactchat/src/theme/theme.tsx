import { createTheme } from "@mui/material";

/*
Этот блок declare module используется для 
расширения типов в TypeScript. Мы говорим 
TypeScript о том, что добавляем новые свойства 
в объект типа Theme и ThemeOptions 
из библиотеки Material-UI.
*/  
declare module "@mui/material/styles" {

    /*
    Далее мы расширяем тип Theme, 
    добавляя новое свойство primaryAppBar, 
    которое представляет собой объект 
    с единственным свойством height, 
    представляющим высоту панели приложения.
    */ 
    interface Theme {
        primaryAppBar: {
            height : number;
        };
    }

    interface ThemeOptions {
        primaryAppBar: {
            height: number;
        };
    }
}

 /* Теперь, когда мы добавили новый параметр 
 в Интерфейс, мы перезапишем функцию 
 создания темы , где укажем размер верхнего меню */
export const createMuiTheme = () =>{
    let theme = createTheme({
        primaryAppBar:{
            height:50,
        },
        /* 
        ниже мы обнуляем цвет текста в верхнем
        меню на по-умолчанию, т.е. на черный, а также
        убираем тень верхнего меню
        */
        components:{
            MuiAppBar:{
                defaultProps:{
                    color:"default",
                    elevation:0,
                }
            }
        }
    })
    return theme;
};

/* Ну и наконец экспортируем эту функцию */
export default createMuiTheme;