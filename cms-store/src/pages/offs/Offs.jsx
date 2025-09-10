import React, { useState, useEffect } from "react";
import ErrorBox from "../../components/errorBox/ErrorBox";
import DetailsModal from "../../components/detailsModal/DetailsModal";
import DeleteModal from "../../components/deleteModal/DeleteModal";
import { useAuthFetch } from "../../hooks/useAuthFetch";
// import EditModal from "../../components/editModal/EditModal";
// import { AiOutlineDollarCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaInfoCircle,
  FaTrash,
  FaReply,
  FaCheck,
  FaEye,
  FaTimes,
} from "react-icons/fa";

function Offs() {
  const { authFetch } = useAuthFetch();
  const [allOffs, setAllOffs] = useState([]);
  const [isShowDetailsModal, setIsShowDetailsModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowStausModal, setIsShowStausModal] = useState(false);
  const [mainOffInfo, setMainOffInfo] = useState({});
  const [offID, setOffID] = useState(null);
  const [isActive, setIsAcive] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | cancelled

  const filteredOffs = allOffs.filter((off) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return off.isActive === 1;
    if (statusFilter === "cancelled") return off.isActive === 0;
  });

  useEffect(() => {
    getAllOffs();
  }, []);

  const getAllOffs = async () => {
    const { error, data } = await authFetch("http://localhost:8001/api/offs");
    if (error) {
      console.error("Fetch error:", error);
    } else {
      setAllOffs(data);
    }
  };

  const updateOffsStatus = async (offID, isActive) => {
    const isActiveNumber = isActive === true || isActive === "true" ? 1 : 0;
    console.log(offID, isActive);

    const { error, data } = await authFetch(
      `http://localhost:8001/api/offs/active-off/${offID}/${isActiveNumber}`,
      "PUT"
    );
    if (error) {
      toast.error("Error! Status NOT Changed", {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      getAllOffs();
      toast.success("Success! Status Changed", {
        position: "bottom-left",
        autoClose: 2000,
      });
      console.log(data);
    }

    setIsShowStausModal(false);
  };

  const submitActionDeleteModal = async () => {
    console.log("deleted");
    try {
      await fetch(`http://localhost:8001/api/offs/${offID}`, {
        method: "DELETE",
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Server Error: ${res}`);
          }
          await res.json();
        })
        .then((data) => {
          getAllOffs();
          toast.success("Success! off deleted", {
            position: "bottom-left",
            autoClose: 3000,
          });
        });
    } catch (error) {
      toast.error("Error! off not delete", {
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
          Off list
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
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/4 lg:w-1/5 xl:w-1/7">
                Product
              </th>
              <th className="hidden lg:table-cell px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase lg:w-1/5 xl:w-1/7">
                percent
              </th>
              <th className="hidden xl:table-cell px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase xl:w-1/7">
                Date & Time
              </th>
              <th className="hidden xl:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase xl:w-1/7">
                Admin
              </th>

              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/4 lg:w-1/5 xl:w-1/7">
                Code
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-1/4 lg:w-1/5 xl:w-1/7">
                Status
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-1/4 lg:w-1/5 xl:w-1/7">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredOffs.length ? (
              filteredOffs.map((off) => (
                <tr key={off.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800  max-w-[120px] whitespace-wrap">
                    {off.productID}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-2 pl-10 text-sm text-gray-800 truncate max-w-[120px]">
                    {off.percent}
                  </td>
                  <td className="hidden xl:table-cell px-4 py-2 text-sm text-gray-800 whitespace-wrap">
                    {off.date}
                  </td>
                  <td className="hidden xl:table-cell px-4 py-2 text-sm text-gray-800 text-center">
                    {off.adminID}
                  </td>

                  <td className="px-4 py-2 text-xs sm:text-sm text-gray-800 whitespace-nowrap">
                    {off.code}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        off.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {off.isActive ? "Active" : "Cancelled"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-center">
                    <div className="grid grid-cols-1 justify-center gap-y-1 sm:inline-flex   space-x-1">
                      <button
                        className="p-1 w-full bg-gray-100 sm:bg-inherit sm:w-auto hover:bg-gray-200 rounded flex justify-center"
                        onClick={() => {
                          setIsShowDetailsModal(true);
                          setMainOffInfo(off);
                        }}
                      >
                        <FaInfoCircle className="text-gray-400" />
                      </button>
                      <button
                        className="p-1 w-full bg-orange-200 sm:bg-inherit sm:w-auto hover:bg-orange-300 sm:hover:bg-gray-200 rounded flex justify-center"
                        onClick={() => {
                          setIsShowStausModal(true);
                          setOffID(off.id);
                          setIsAcive(off.isActive);
                        }}
                      >
                        {off.isActive ? (
                          <FaTimes className="text-orange-400" />
                        ) : (
                          <FaCheck className="text-green-400" />
                        )}
                      </button>

                      <button
                        className="p-1 w-full bg-red-200 sm:bg-inherit sm:w-auto hover:bg-red-300 sm:hover:bg-gray-200 rounded flex justify-center"
                        onClick={() => {
                          setIsShowDeleteModal(true);
                          setOffID(off.id);
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
          <table className="table-fixed w-full bg-white rounded-2xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Admin
                </th>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Date & Time
                </th>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Percent
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  {mainOffInfo.adminID}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-wrap text-sm sm:text-base">
                  {mainOffInfo.date}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  {mainOffInfo.percent}
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
              ? "Do you want Cancel this off ?"
              : "Do you want Active this off ?"
          }
          cancelAction={() => setIsShowStausModal(false)}
          submitAction={() => updateOffsStatus(offID, !isActive)}
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

export default Offs;
