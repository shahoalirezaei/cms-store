import React from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { SlBasketLoaded } from "react-icons/sl";
import { TbUsersGroup } from "react-icons/tb";
import { CiDollar } from "react-icons/ci";

const summaryData = [
  { id: 1, title: "Products", value: 120, icon: <AiOutlineProduct />, bgColor: "bg-blue-500" },
  { id: 2, title: "Orders", value: 87, icon: <SlBasketLoaded />, bgColor: "bg-green-500" },
  { id: 3, title: "Users", value: 54, icon: <TbUsersGroup />, bgColor: "bg-purple-500" },
  { id: 4, title: "Revenue", value: "$12,400", icon: <CiDollar />, bgColor: "bg-yellow-500" },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 mt-8">
      {summaryData.map(({ id, title, value, icon, bgColor }) => (
        <div
          key={id}
          className={`flex items-center justify-center space-x-10 p-5 rounded-xl text-zinc-700 text-xs lg:text-base shadow-lg bg-white`}
        >
          <div className="text-3xl lg:text-2xl">{icon}</div>
          <div>
            <h3 className="text-base lg:text-sm font-medium mb-1">{title}</h3>
            <p className="text-base lg:text-sm font-semibold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
