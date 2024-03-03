import { FC } from "react";
import { TItem } from "../utils/types";

interface IItem {
  item: TItem;
}

const Item: FC<IItem> = ({ item }) => {

  return (
    <div key={item.id} className="flex flex-col border space-y-2 border-gray-600 bg-gray-800 rounded-xl p-6 hover:scale-105 transition duration-200 shadow-lg">
      <p className="font-bold text-gray-100 text-2xl mb-2">{item.brand}</p>
      <p className="text-gray-200 font-medium text-lg">{item.product}</p>
      <p className="font-medium text-gray-300">Price: {item.price}</p>
      <div className="font-medium text-gray-300">Article: 
        <p className="text-gray-500">{item.id}</p>
      </div>
    </div>
  )
};

export default Item;