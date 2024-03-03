/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FC, useEffect, useState } from "react";
import { getGoods } from "./api/api";
import Item from "./Item";
import { TItem } from "../utils/types";
import { getUnique } from "../utils/additional";

const ItemsList: FC = () => {
  const [itemsList, setGoodsList] = useState<TItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchString, setSearchString] = useState<string>('');
  const [filteredGoods, setFilteredGoods] = useState<TItem[]>([]);
  // получаем и обрабатываем товары
  const getDataFromServer = async () => {
    const products = await getGoods();
    const allProducts= products.flat();
    const uniqueProducts = getUnique(allProducts, 'id');
    setGoodsList(uniqueProducts);
    setFilteredGoods(uniqueProducts);
    setTotalPages(Math.ceil(uniqueProducts.length / 50));
  }
  // получение данных при монтировании компонента
  useEffect(() => {
    getDataFromServer();
  }, [])
  // функция, фильтрующая товары на основе строки в инпуте
  const filterGoods = (str: string) => {
    const filtered = itemsList.filter((product: TItem) => {
      const productNameMatch = product.product.toLowerCase().includes(str.toLowerCase());
      const idMatch = product.id.toLowerCase().includes(str.toLowerCase());
      const brandMatch = product.brand && product.brand.toLowerCase().includes(str.toLowerCase());
      const priceMatch = product.price && product.price.toString().toLowerCase().includes(str.toLowerCase());

      return productNameMatch || idMatch || brandMatch || priceMatch;
    });

    setFilteredGoods(filtered);
    setTotalPages(Math.ceil(filtered.length / 50));
    setPage(1);
  };
  // хэндлер для фильтрации
  const handleFilterGoods = (evt: ChangeEvent<HTMLInputElement>) => {
    setSearchString(evt.target.value);
    filterGoods(evt.target.value);
  };
  // функция пагинации
  const setPagination = (array: TItem[], length: number, pageNumber: number) => {
    return array.slice((pageNumber - 1) * length, pageNumber * length);
  }
  // функция переключения страницы
  const handlePageChange = (page: number) => {
    setPage(page);
  };



  return (
    <div className="container mx-auto max-w-6xl py-20">
      <div className="py-6">
        <input
          type="text"
          name="goodsFilter"
          placeholder="Searches"
          value={searchString}
          onChange={handleFilterGoods}
          className="py-2 px-3 rounded-lg border border-gray-600 bg-gray-700 text-white"
        />
      </div>
      <div className="grid grid-cols-3 gap-6">
        {setPagination(filteredGoods, 50, page).map((item: TItem) => (
          <Item
            item={item}
            key={item.id}
          />
        ))}
      </div>
      <div className="flex gap-6 items-center justify-center pt-8">
        <button
          type="button"
          className="text-gray-200 font-semibold border px-6 py-2 rounded-lg hover:bg-gray-800 cursor-pointer transition duration-200"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
        Previous
        </button>
        <div className="text-gray-200">{page}/{totalPages}</div>
        <button
          type="button"
          className="text-gray-200 font-semibold border px-8 py-2 rounded-lg hover:bg-gray-800 cursor-pointer transition duration-200"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
};

export default ItemsList;