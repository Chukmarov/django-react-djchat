import useAxiosWithInterceptor from "../helpers/jwtinterceptor";
import { BASE_URL } from "../config";
import { useState } from "react";

/* 
Здесь определен интерфейс IuseCrud, 
который описывает структуру объекта, 
возвращаемого хуком useCrud. Этот объект включает в себя:

dataCRUD: массив данных (generic тип T).
fetchData: функцию для получения данных.
error: объект ошибки или null, если ошибки нет.
isLoading: флаг, указывающий, идет ли в данный момент загрузка данных.
*/
interface IuseCrud<T> {
  dataCRUD: T[];
  fetchData: () => Promise<void>;
  error: Error | null;
  isLoading: boolean;
}

/* 
Этот код определяет хук useCrud. Внутри хука:
Создается объект jwtAxios с использованием функции useAxiosWithInterceptor.
Определяются состояния с использованием useState: dataCRUD, error и isLoading.
Создается функция fetchData, которая:
Устанавливает флаг isLoading в true.
Отправляет запрос к API с использованием Axios (jwtAxios.get).
Обрабатывает успешный ответ, обновляя данные, 
сбрасывает ошибку, устанавливает флаг isLoading в 
false и возвращает полученные данные.
В случае ошибки, обрабатывает ошибку, 
устанавливает флаг isLoading в false, 
бросает ошибку и, если ошибка связана с HTTP-статусом 400, устанавливает ошибку "400".
Возвращается объект, содержащий функцию fetchData, данные, ошибку и флаг isLoading.
*/

const useCrud = <T>(initialData: T[], apiURL: string): IuseCrud<T> => {
  const jwtAxios = useAxiosWithInterceptor();
  const [dataCRUD, setDataCrud] = useState<T[]>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await jwtAxios.get(`${BASE_URL}${apiURL}`, {});
      const data = response.data;
      setDataCrud(data);
      setError(null);
      setIsLoading(false);
      return data;
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError(new Error("400"));
      }
      setIsLoading(false);
      throw error;
    }
  };
  return { fetchData, dataCRUD, error, isLoading };
};
export default useCrud;
