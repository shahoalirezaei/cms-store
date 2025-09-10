import React, { useEffect, useState } from "react";
import ErrorBox from "../errorBox/ErrorBox";
import {
  FaEdit,
  FaInfoCircle,
  FaTrash,
  FaReply,
  FaCheck,
  FaEye,
  FaTimes,
} from "react-icons/fa";

function LastOrdersTable() {
  const [lastOrders, setLastOrders] = useState([]);

  useEffect(() => {
    getLastOreders();
  }, []);

  const getLastOreders = async () => {
    try {
      await fetch("http://localhost:8001/api/orders")
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Server Error: ${res.status}`);
          }
          const text = await res.text();
          if (!text) {
            return [];
          }
          return JSON.parse(text);
        })
        .then((data) => {
          const sortedData = data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setLastOrders(sortedData);
        });
    } catch (error) {
      console.log(`Fetch error: ${error}`);
    }
  };

  return (
    <>
      <div className="p-4 overflow-x-hidden">
        <h4 className="text-base  my-3 border-b pb-1.5 border-b-gray-300 ">
          Last Orders
        </h4>

        <table className="table-fixed w-full bg-white rounded-2xl ">
          <thead className="bg-gray-100">
            <tr>
              {/* Always 4 columns on mobile, 5 on lg, 8 on xl */}
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/4 lg:w-1/5 xl:w-1/8">
                Product
              </th>
              <th className="hidden lg:table-cell px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase lg:w-1/5 xl:w-1/8">
                Customer
              </th>
              <th className="hidden xl:table-cell px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase xl:w-1/8">
                Date & Time
              </th>
              <th className="hidden xl:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase xl:w-1/8">
                Qty
              </th>
              <th className="hidden xl:table-cell px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase xl:w-1/8">
                Unit Price
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/4 lg:w-1/5 xl:w-1/8">
                Total
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/4 lg:w-1/5 xl:w-1/8">
                Status
              </th>
            </tr>
          </thead>
          </table>

          <div className="max-h-[250px] overflow-y-scroll scrollbar-custom">
            <table>
          <tbody className="divide-y divide-gray-200 bg-white ">
            {lastOrders.length ? (
              lastOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800   whitespace-wrap w-1/4 lg:w-1/5 xl:w-1/8">
                    {order.productID}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-2 text-sm text-gray-800 truncate  lg:w-1/5 xl:w-1/8">
                    {order.userID}
                  </td>
                  <td className="hidden xl:table-cell px-4 py-2 text-sm text-gray-800 whitespace-wrap xl:w-1/8">
                    {new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(`${order.date}T${order.hour}`))}
                  </td>
                  <td className="hidden xl:table-cell px-4 py-2 text-sm text-gray-800 text-center xl:w-1/8">
                    {order.count}
                  </td>
                  <td className="hidden xl:table-cell px-4 py-2 text-sm text-gray-800 whitespace-nowrap xl:w-1/8">
                    ${order.price}
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800 whitespace-nowrap w-1/4 lg:w-1/5 xl:w-1/8">
                    $
                    {(
                      order.price *
                      order.count *
                      (1 - (order.off || 0) / 100)
                    ).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm w-1/4 lg:w-1/5 xl:w-1/8">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.isActive ? "Active" : "Cancelled"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <ErrorBox msg="Oops! No Users to display." colCount={7} />
            )}
          </tbody>
          </table>
          </div>
        
      </div>
    </>
  );
}

export default LastOrdersTable;
