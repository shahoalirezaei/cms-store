import React, { useEffect, useState } from "react";
import ErrorBox from "../../components/errorBox/ErrorBox";
import DetailsModal from "../../components/detailsModal/DetailsModal";
import DeleteModal from "../../components/deleteModal/DeleteModal";
import { toast } from "react-toastify";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { FaInfoCircle, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

function Orders() {
  const { authFetch } = useAuthFetch();
  const [allOrders, setAllOrders] = useState([]);
  const [isShowDetailsModal, setIsShowDetailsModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowStausModal, setIsShowStausModal] = useState(false);
  const [mainOrderInfo, setMainOrderInfo] = useState({});
  const [orderID, setOrderID] = useState(null);
  const [isActive, setIsAcive] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | cancelled

  const filteredOrders = allOrders.filter((order) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return order.isActive === 1;
    if (statusFilter === "cancelled") return order.isActive === 0;
  });

  useEffect(() => {
    getAllOreders();
  }, []);

  const getAllOreders = async () => {
    const { error, data } = await authFetch("http://localhost:8001/api/orders");
    if (error) {
      console.error("Fetch error:", error);
    } else {
      setAllOrders(data);
    }
  };

  const updateOrderStatus = async (orderID, isActive) => {
    // console.log(orderID, isActive);
    const isActiveNumber = isActive === true || isActive === "true" ? 1 : 0;

    const { error, data } = await authFetch(
      `http://localhost:8001/api/orders/active-order/${orderID}/${isActiveNumber}`,
      "PUT"
    );
    if (error) {
      toast.error("Error! Status NOT Changed", {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      getAllOreders();
      toast.success("Success! Status Changed", {
        position: "bottom-left",
        autoClose: 3000,
      });
    }

    setIsShowStausModal(false);
  };

  const submitActionDeleteModal = async () => {
    console.log("deleted");

    const { error, data } = await authFetch(
      `http://localhost:8001/api/orders/${orderID}`,
      "DELETE"
    );
    if (error) {
      toast.error("Error! order not delete", {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      getAllOreders();
      toast.success("Success! order deleted", {
        position: "bottom-left",
        autoClose: 3000,
      });
    }

    setIsShowDeleteModal(false);
  };

  return (
    <>
      <div className="p-4 overflow-x-hidden">
        <h4 className="text-xl font-medium md:font-semibold my-4 md:text-2xl">
          Order list
        </h4>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 rounded ${
              statusFilter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1 rounded ${
              statusFilter === "active"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter("cancelled")}
            className={`px-3 py-1 rounded ${
              statusFilter === "cancelled"
                ? "bg-red-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Cancelled
          </button>
        </div>

        <table className="table-fixed w-full bg-white rounded-2xl">
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
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-1/4 lg:w-1/5 xl:w-1/8">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredOrders.length ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800  max-w-[120px] whitespace-wrap">
                    {order.productID}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-2 text-sm text-gray-800 truncate max-w-[120px]">
                    {order.userID}
                  </td>
                  <td className="hidden xl:table-cell px-4 py-2 text-sm text-gray-800 whitespace-wrap">
                    {new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(`${order.date}T${order.hour}`))}
                  </td>
                  <td className="hidden xl:table-cell px-4 py-2 text-sm text-gray-800 text-center">
                    {order.count}
                  </td>
                  <td className="hidden xl:table-cell px-4 py-2 text-sm text-gray-800 whitespace-nowrap">
                    ${order.price}
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800 whitespace-nowrap">
                    $
                    {(
                      order.price *
                      order.count *
                      (1 - (order.off || 0) / 100)
                    ).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm">
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
                  <td className="px-4 py-2 text-sm text-center">
                    <div className="grid grid-cols-1 justify-center gap-y-1 sm:inline-flex   space-x-1">
                      <button
                        className="p-1 w-full bg-gray-100 sm:bg-inherit sm:w-auto hover:bg-gray-200 rounded flex justify-center"
                        onClick={() => {
                          setIsShowDetailsModal(true);
                          setMainOrderInfo(order);
                        }}
                      >
                        <FaInfoCircle className="text-gray-400" />
                      </button>
                      <button
                        className="p-1 w-full bg-orange-200 sm:bg-inherit sm:w-auto hover:bg-orange-300 sm:hover:bg-gray-200 rounded flex justify-center"
                        onClick={() => {
                          setIsShowStausModal(true);
                          setOrderID(order.id);
                          setIsAcive(order.isActive);
                        }}
                      >
                        {order.isActive ? (
                          <FaTimes className="text-orange-400" />
                        ) : (
                          <FaCheck className="text-green-400" />
                        )}
                      </button>

                      <button
                        className="p-1 w-full bg-red-200 sm:bg-inherit sm:w-auto hover:bg-red-300 sm:hover:bg-gray-200 rounded flex justify-center"
                        onClick={() => {
                          setIsShowDeleteModal(true);
                          setOrderID(order.id);
                        }}
                      >
                        <FaTrash className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <ErrorBox msg="Oops! No Users to display." colCount={8} />
            )}
          </tbody>
        </table>
      </div>
      {isShowDetailsModal && (
        <DetailsModal onHide={() => setIsShowDetailsModal(false)}>
          {/* Details in Mobile screen */}
          <div className="block md:hidden space-y-4">
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between py-1 px-2.5 rounded-xl bg-gray-100">
                <span className="font-light text-gray-500 p-2 rounded-xl">
                  Product
                </span>
                <span>{mainOrderInfo.productID}</span>
              </div>
              <div className="flex justify-between py-1 px-2.5 rounded-xl">
                <span className="font-light text-gray-500">Customer</span>
                <span>{mainOrderInfo.userID}</span>
              </div>
              <div className="flex justify-between py-1 px-2.5 rounded-xl bg-gray-100">
                <span className="font-light text-gray-500">Qty</span>
                <span>{mainOrderInfo.count}</span>
              </div>
              <div className="flex justify-between py-1 px-2.5 rounded-xl">
                <span className="font-light text-gray-500">Popularity</span>
                <span>{mainOrderInfo.popularity}</span>
              </div>
              <div className="flex justify-between py-1 px-2.5 rounded-xl bg-gray-100">
                <span className="font-light text-gray-500">Status</span>
                <span>{mainOrderInfo.status}</span>
              </div>
              <div className="flex justify-between py-1 px-2.5 rounded-xl">
                <span className="font-light text-gray-500">Price</span>
                <span>{mainOrderInfo.price}</span>
              </div>
              <div className="flex justify-between py-1 px-2.5 rounded-xl bg-gray-100">
                <span className="font-light text-gray-500">SaleCount</span>
                <span>{mainOrderInfo.sale_count}</span>
              </div>
              <div className="flex justify-between py-1 px-2.5 rounded-xl">
                <span className="font-light text-gray-500">Date</span>
                <span>{mainOrderInfo.date}</span>
              </div>
              <div className="flex justify-between py-1 px-2.5 rounded-xl bg-gray-100">
                <span className="font-light text-gray-500">Hour</span>
                <span>{mainOrderInfo.hour}</span>
              </div>
            </div>
          </div>

          {/* Details in desctop screen */}
          <table className="hidden md:block w-full bg-white rounded-2xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Date & Time
                </th>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Qty
                </th>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Unit Price
                </th>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Sale
                </th>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Popularity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-wrap text-sm sm:text-base">
                  {mainOrderInfo.date && mainOrderInfo.hour
                    ? new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(
                        new Date(`${mainOrderInfo.date}T${mainOrderInfo.hour}`)
                      )
                    : "Invalid date"}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-wrap text-sm sm:text-base">
                  {mainOrderInfo.count}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  {mainOrderInfo.price}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  {mainOrderInfo.sale}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  {mainOrderInfo.popularity}
                </td>
              </tr>
            </tbody>
          </table>
        </DetailsModal>
      )}
      {isShowStausModal && (
        <DeleteModal
          title={
            isActive
              ? "Do you want Cancel this order?"
              : "Do you want Active this order?"
          }
          cancelAction={() => setIsShowStausModal(false)}
          submitAction={() => updateOrderStatus(orderID, !isActive)}
        />
      )}
      {isShowDeleteModal && (
        <DeleteModal
          title="Are you sure to delete this order?"
          cancelAction={() => setIsShowDeleteModal(false)}
          submitAction={submitActionDeleteModal}
        />
      )}
    </>
  );
}

export default Orders;
