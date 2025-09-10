import React, { useEffect, useState } from "react";
import ErrorBox from "../../components/errorBox/ErrorBox";
import DetailsModal from "../../components/detailsModal/DetailsModal";
import DeleteModal from "../../components/deleteModal/DeleteModal";
import EditModal from "../../components/editModal/EditModal";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { FaEdit, FaInfoCircle, FaTrash } from "react-icons/fa";

function Users() {
  const { authFetch } = useAuthFetch();
  const [allUsers, setAllUsers] = useState([]);
  const [isShowDetailsModal, setIsShowDetailsModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [mainUserInfo, setMainUserInfo] = useState({});
  const [userID, setUserID] = useState(null);
  // States for edit modal form
  const [newUserImg, setNewUserImg] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newAddres, setNewAddres] = useState("");
  const [newScore, setNewScore] = useState("");
  const [newBuy, setNewBuy] = useState("");

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    const { error, data } = await authFetch("http://localhost:8001/api/users");
    if (error) {
      console.error("Fetch error:", error);
    } else {
      setAllUsers(data);
    }
  };

  const userAllNewInfos = (mainUser) => {
    setNewUserImg(mainUser.img);
    setNewFirstName(mainUser.firsname);
    setNewLastName(mainUser.lastname);
    setNewUserName(mainUser.username);
    setNewPassword(mainUser.password);
    setNewPhone(mainUser.phone);
    setNewEmail(mainUser.email);
    setNewCity(mainUser.city);
    setNewAddres(mainUser.address);
    setNewScore(mainUser.score);
    setNewBuy(mainUser.buy);
  };

  const updateUserInfos = async (event) => {
    event.preventDefault();

    const newUserInfos = {
      firsname: newFirstName,
      lastname: newLastName,
      username: newUserName,
      password: newPassword,
      phone: newPhone,
      city: newEmail,
      email: newCity,
      address: newAddres,
      score: newScore,
      buy: newBuy,
      img: newUserImg,
    };

    // Check for empty values
    const hasEmptyField = Object.values(newUserInfos).some(
      (value) =>
        value === undefined || value === null || value.toString().trim() === ""
    );

    if (hasEmptyField) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const { error, data } = await authFetch(
      `http://localhost:8001/api/users/${userID}`,
      "PUT",
      newUserInfos
    );
    if (error) {
      toast.error("Error! User not update", {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      getAllUsers();
      toast.success("Success! User updated", {
        position: "bottom-left",
        autoClose: 3000,
      });
    }

    setIsShowEditModal(false);
  };

  const submitActionDeleteModal = async () => {
    // console.log('submited');

    const { error, data } = await authFetch(
      `http://localhost:8001/api/users/${userID}`,
      "DELETE"
    );
    if (error) {
      toast.error("Error! user not delete", {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      getAllUsers();
      toast.success("Success! user deleted", {
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
          User list
        </h4>

        <table className="table-fixed w-full bg-white rounded-2xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 sm:px-4 py-2 text-center hidden sm:table-cell text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                User
              </th>
              <th className="px-2 sm:px-4 py-2 text-center  text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 sm:w-1/5">
                UserName
              </th>
              <th className="px-2 sm:px-4 py-2 text-center text-xs hidden xl:table-cell font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Password
              </th>
              <th className="px-2 sm:px-4 py-2 text-center text-xs  font-medium text-gray-500 uppercase tracking-wider w-1/3 sm:w-1/5">
                Phone
              </th>
              <th className="px-2 sm:px-4 py-2 text-center hidden lg:table-cell text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 sm:w-1/5">
                Email
              </th>
              <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5 lg:w-1/3">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {allUsers.length ? (
              allUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="text-center sm:pl-0  hidden sm:table-cell lg:flex items-center justify-center flex-col flex-wrap sm:px-4 py-2  text-gray-800 whitespace-nowrap text-sm ">
                    <img
                      src={user.img ? user.img : ""}
                      className="w-10 h-10 rounded-2xl mb-1.5 object-contain mx-auto"
                    />
                    <p className=" flex-wrap line-clamp-2 max-w-[150px] hidden lg:table-cell">
                      {user.firsname} {user.lastname}
                    </p>
                  </td>
                  <td className="text-center px-4 py-2 text-gray-800 text-xs sm:text-sm ">
                    {user.username}
                  </td>
                  <td className="text-center px-4 py-2 hidden xl:table-cell text-gray-800 text-xs sm:text-sm">
                    {user.password}
                  </td>
                  <td className="text-center px-4 py-2 text-gray-800 text-xs sm:text-sm">
                    {user.phone}
                  </td>
                  <td className="text-center hidden lg:table-cell px-4 py-2 max-w-[150px] text-gray-800 align-top">
                    <p className="text-sm break-words">{user.email}</p>
                  </td>
                  <td className="px-1 md:px-4 py-2 ">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setIsShowEditModal(true);
                          setUserID(user.id);
                          userAllNewInfos(user);
                        }}
                      >
                        <FaEdit className="sm:hidden" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          setIsShowDeleteModal(true);
                          setUserID(user.id);
                        }}
                      >
                        <FaTrash className="sm:hidden" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                      <button
                        className="details-btn"
                        onClick={() => {
                          setIsShowDetailsModal(true);
                          setMainUserInfo(user);
                        }}
                      >
                        <FaInfoCircle className="sm:hidden" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <ErrorBox msg="Oops! No Users to display." colCount={6} />
            )}
          </tbody>
        </table>
      </div>
      {isShowEditModal && (
        <EditModal
          onClose={() => setIsShowEditModal(false)}
          onSubmit={(e) => updateUserInfos(e)}
          title="Please enter the new user infos"
        >
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="Name"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="LastName"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="User name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="number"
              placeholder="Phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="City"
              value={newCity}
              onChange={(e) => setNewLastName(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="Address"
              value={newAddres}
              onChange={(e) => setNewAddres(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="text"
              placeholder="Score"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
            />
          </div>
          <div className="input-wrapper w-full text-sm flex items-center bg-[#f0f0f0] py-2 px-4 rounded-xl gap-x-2 ">
            <span>
              <AiOutlineDollarCircle />
            </span>
            <input
              className="w-full outline-0 h-full"
              type="number"
              placeholder="Buy"
              value={newBuy}
              onChange={(e) => setNewBuy(e.target.value)}
            />
          </div>
        </EditModal>
      )}
      {isShowDetailsModal && (
        <DetailsModal onHide={() => setIsShowDetailsModal(false)}>
          <table className="table-fixed w-full bg-white rounded-2xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="sm:table-cell px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  City
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
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  {mainUserInfo.city}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-wrap text-sm sm:text-base">
                  {mainUserInfo.address}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  {mainUserInfo.score}
                </td>
                <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                  ${mainUserInfo.buy}
                </td>
              </tr>
            </tbody>
          </table>
        </DetailsModal>
      )}
      {isShowDeleteModal && (
        <DeleteModal
          title="Are you sure to delete this user?"
          cancelAction={() => setIsShowDeleteModal(false)}
          submitAction={submitActionDeleteModal}
        />
      )}
    </>
  );
}

export default Users;
