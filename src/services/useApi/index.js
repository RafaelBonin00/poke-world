import { useState, useEffect } from "react";
import ReturnApi from "../../services/returnapi";

function useApi(request) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!request) return;

    ReturnApi(request)
      .then(result => {
        setData(result);
      })
  }, [request]);

  return { data };
}

export default useApi;
