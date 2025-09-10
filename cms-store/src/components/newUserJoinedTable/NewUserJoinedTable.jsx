import React, { useState, useEffect } from "react";
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

function NewUserJoinedTable({ details, isShowDetails }) {
  const [allUsers, setAllUsers] = useState([]);
//   const [isShowDetailsModal, setIsShowDetailsModal] = useState(false);
 
  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      await fetch("http://localhost:8001/api/users")
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
          setAllUsers(data);
        });
    } catch (error) {
      // console.log(`Fetch error: ${error}`);
    }
  };
  return (
    <div className="p-4 overflow-x-hidden  rounded-2xl ">
      <h4 className="text-base  my-3 border-b pb-1.5 border-b-gray-300">
        New Users
      </h4>

      <div className="max-h-[300px] overflow-y-scroll scrollbar-custom bg-white">
        {allUsers.length ? (
        allUsers.map((user) => (
          <div key={user.id} className="w-full flex justify-between items-center py-3 pl-2.5 ">
            <div className="w-1/3 md:hidden lg:block">
                <img
              src={user.img ? user.img : ""}
              className="w-12 h-12 rounded-full mb-1.5 object-contain  "
            />
            </div>
            <div className="w-1/3">
              <p className=" flex-nowrap  max-w-[150px] text-sm  text-zinc-800">
                {user.username}
              </p>
              <span className="text-xs text-zinc-400">{user.email}</span>
            </div>
            <button
              className="w-1/3 text-right pr-4 md:pr-2 lg:pr-5"
              onClick={() => {
                details(user)
                isShowDetails()
            }}
            >
              <FaInfoCircle className="ml-auto sm:mx-auto md:mx-0 md:ml-auto"  />
            </button>
          </div>
        ))
        
      ) : (
        <p className="text-center py-4 text-blue-50 text-base lg:text:2xl bg-red-800">
            Oops! No Users to display.
        </p>
      )}
      </div>
    </div>
  );
}

export default NewUserJoinedTable;
