import React, { useState } from "react";
import MonthlySalesChart from "../../components/monthlySalesChart/MonthlySalesChart";
import SummaryCards from "../../components/summaryData/SummaryCards";
import NewUserJoinedTable from "../../components/newUserJoinedTable/NewUserJoinedTable";
import LastOrdersTable from "../../components/lastOrders/LastOrdersTable";
import DetailsModal from "../../components/detailsModal/DetailsModal";
import { useEffect } from "react";

function Dashboard() {
  const [isShowDetailsModal, setIsShowDetailsModal] = useState(false);
  const [mainUserInfos, setMainUserInfos] = useState({});

  const showUserInfos = (user) => {
    setMainUserInfos(user);
  };

  const showDetalisModal = () => {
    setIsShowDetailsModal(true)
  }

  return (
    <>
      <SummaryCards />
      <MonthlySalesChart />
      <div className="w-full flex flex-col gap-7 md:gap-3 md:grid md:grid-cols-[1fr_2fr] bg-inherit">
        <NewUserJoinedTable
          details={showUserInfos}
          isShowDetails={showDetalisModal}
        />
        <LastOrdersTable />
      </div>
      {isShowDetailsModal && (
        <DetailsModal onHide={() => setIsShowDetailsModal(false)}>
          <table className="table-fixed w-full bg-white rounded-2xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Name
                </th>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Address
                </th>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Score
                </th>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Total buy
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-wrap text-sm sm:text-base">
                  {mainUserInfos.firsname} {mainUserInfos.lastname}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-wrap text-sm sm:text-base">
                  {mainUserInfos.address}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  {mainUserInfos.score}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  ${mainUserInfos.buy}
                </td>
              </tr>
            </tbody>
          </table>
        </DetailsModal>
      )}
    </>
  );
}

export default Dashboard;
