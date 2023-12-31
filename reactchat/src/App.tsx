import Home from "./pages/Home"
import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider, 
} from "react-router-dom"
// вот тут мы импортируем измененую тему
// для нашего приложения из папки theme
import { createMuiTheme } from "./theme/theme";
import { ThemeProvider } from "@emotion/react";

/*
Ниже пойдет самое интересное. Тут две обертки Одна вложена в другую
Я так опонимаю тут будет перечень созданых роутов из элементов
Т.е. мы сначала импортировали элемент Home, после сделали из него роут
И уже из этого роута создали браузерный роут. Видимо есть какой то нюанс
*/
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element = {<Home/>}/>
    </Route>
  )
)

/*
React.FC расшифровывается как React Functional Component. 
Это тип, предоставляемый библиотекой React для 
типизации функциональных компонентов.
Когда мы пишем const App: React.FC = () => {...}, 
мы говорим TypeScript, что App - это функциональный 
компонент, использующий React. 
Это позволяет TypeScript применять определенные проверки типов и 
обеспечивает более строгую типизацию для компонента.

Возвращение React.FC в данном случае не является обязательным, 
но это хорошая практика для явного указания типа компонента. 
Это делает код более читаемым и обеспечивает дополнительные преимущества в работе с TypeScript, 
такие как автодополнение и предупреждения об ошибках на этапе компиляции.

Таким образом, const App: React.FC = () => {...} говорит TypeScript, 
что App - это функциональный компонент, 
использующий React, что помогает в правильной типизации компонента.
*/
const App: React.FC = () =>{
  // вот тут мы переопределяем тему
  // и создаем ее при роутинге
  const theme = createMuiTheme();
  return(
    <ThemeProvider theme = {theme}>
        <RouterProvider router={router}/>
    </ThemeProvider> 
    
  )
}


export default App
