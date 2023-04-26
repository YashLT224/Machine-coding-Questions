import { useEffect, useRef, useState, useCallback } from "react";

export default function InfiniteScroll(props) {
  const { renderListItem, getData, listData, query } = props;
  const pageNumber = useRef(1);
  const [loading, setLoading] = useState(false);

  const observer = useRef(null);
  const lastElementObserver = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        pageNumber.current += 1;
        fetchData();
      }
    });
    if (node) observer.current.observe(node);
  });

  const fetchData = useCallback(() => {
    setLoading(true);
    getData(query, pageNumber.current).finally(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderList = useCallback(() => {
    return listData.map((item, index) => {
      // return renderListItem(item.title, index);
      if (index === listData.length - 1) {
        return (
          <div ref={lastElementObserver} key={index}>
            {item.title}
          </div>
        );
      }
      return (
        <div ref={null} key={index}>
          {item.title}
        </div>
      );
    });
  }, [listData]);
  return (
    <>
      {renderList()}
      {loading && "LOADING"}
    </>
  );
}
