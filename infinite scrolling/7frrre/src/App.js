import "./styles.css";
import { useState, useCallback, useRef } from "react";

import InfiniteScroll from "./infiniteScroll";
export default function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  const controllerRef = useRef(null);
  const handleInput = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const renderitem = (title, key, ref) => {
    return <div key={key}>{title}</div>;
  };
  const getData = useCallback((query, pageNo) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();
        const promise = await fetch(
          "https://openlibrary.org/search.json?" +
            new URLSearchParams({
              q: query,
              page: pageNo
            }),
          { signal: controllerRef.current.signal }
        );
        const data = await promise.json();
        console.log(data);
        resolve();
        setData((prev) => [...prev, ...data.docs]);
      } catch (e) {
        reject();
      }
    });
  }, []);
  return (
    <div className="App">
      <input type="text" value={query} onChange={handleInput} />
      <InfiniteScroll
        renderListItem={renderitem}
        getData={getData}
        listData={data}
        query={query}
      ></InfiniteScroll>
    </div>
  );
}
