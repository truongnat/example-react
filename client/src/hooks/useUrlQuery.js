import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useUrlQuery() {
  const [data, setData] = useState(undefined);
  const location = useLocation();

  const mappingQuery = () => {
    const searchParams = new URLSearchParams(location.search).entries();
    let _c = {};
    for (const [key, value] of searchParams) {
      _c[key] = value;
    }
    setData(_c);
  };

  useEffect(() => {
    mappingQuery();
  }, []);

  return data;
}
