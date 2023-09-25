import { useState } from "react";
import axios from "axios";

export const useFetch = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (
    endpoint: string,
    params: object | null,
    body: any,
    headers: object | null
  ) => {
    setIsLoading(true);
    try {
      let options;
      options = {
        method: "GET",
        url: `https://omsappapi.azurewebsites.net/api${endpoint}`,
        params: { ...params },
        headers: { ...headers },
        data: { ...body },
      };

      const response = await axios.request(options);
      setData(response.data.dataList);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, fetchData };
};

export const useSend = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(0);

  const sendData = async (
    endpoint: string,
    params: any,
    headers: any,
    body: any
  ) => {
    setIsLoading(true);
    try {
      let options;
      options = {
        method: "POST",
        url: `https://omsappapi.azurewebsites.net/api${endpoint}`,
        headers: { ...headers },
        params: { ...params },
        data: { ...body },
      };

      axios.request(options).then((response) => {
        setData(response.data);
        setStatusCode(response.status);
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };
  return { data, error, isLoading, sendData, statusCode };
};
