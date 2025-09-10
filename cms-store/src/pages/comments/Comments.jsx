import React, { useEffect, useMemo, useState } from "react";
import ErrorBox from "../../components/errorBox/ErrorBox";
import DetailsModal from "../../components/detailsModal/DetailsModal";
import DeleteModal from "../../components/deleteModal/DeleteModal";
import EditModal from "../../components/editModal/EditModal";
import { toast } from "react-toastify";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import {
  FaEdit,
  FaTrash,
  FaReply,
  FaCheck,
  FaEye,
  FaTimes,
} from "react-icons/fa";

function Comments() {
  const { authFetch } = useAuthFetch();
  const [allComments, setAllComments] = useState([]);
  const [isShowDetailsModal, setIsShowDetailsModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowAcceptModal, setIsShowAcceptModal] = useState(false);
  const [isShowRejectModal, setIsShowRejectModal] = useState(false);
  const [mainCommentInfo, setMainCommentInfo] = useState({});
  const [newCommentBody, setNewCommentBody] = useState({});
  const [commentID, setCommentID] = useState(null);
  const [sortType, setSortType] = useState(null);

  // Sorted comment by usememo
  const sortedComments = useMemo(() => {
    const sorted = [...allComments];
    switch (sortType) {
      case "latest":
        return sorted.sort(
          (a, b) =>
            new Date(b.date + "T" + b.hour) - new Date(a.date + "T" + a.hour)
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.date + "T" + a.hour) - new Date(b.date + "T" + b.hour)
        );
      case "accepted":
        return sorted.sort((a, b) => b.isAccept - a.isAccept);
      case "rejected":
        return sorted.sort((a, b) => a.isAccept - b.isAccept);
      default:
        return sorted;
    }
  }, [allComments, sortType]);

  useEffect(() => {
    getAllComments();
  }, []);

  const getAllComments = async () => {
    const { error, data } = await authFetch(
      "http://localhost:8001/api/comments"
    );
    if (error) {
      console.error("Fetch error:", error);
    } else {
      setAllComments(data);
    }
  };

  const closeDetailsModal = () => {
    setIsShowDetailsModal(false);
  };

  const updateCommentInfo = async (event) => {
    event.preventDefault();
    if (!newCommentBody.trim()) {
      toast.error("Comment text cannot be empty", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const { error, data } = await authFetch(
      `http://localhost:8001/api/comments/${commentID}`,
      "PUT",
      { body: newCommentBody }
    );
    if (error) {
      console.log(error);

      toast.error(`Error: Comment not updated`, {
        position: "top-right",
        autoClose: 5000,
      });
    } else {
      toast.success("Comment updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      getAllComments();
    }
    setIsShowEditModal(false);
  };

  const deleteModalSubmitAction = async () => {
    const { error, data } = await authFetch(
      `http://localhost:8001/api/comments/${commentID}`,
      "DELETE"
    );
    if (error) {
      toast.error(`Error: Comment cannot delete`, {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      getAllComments();
      toast.success("Comment deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setIsShowDeleteModal(false);
  };

  const acceptModalSubmitAction = async () => {
    const { error, data } = await authFetch(
      `http://localhost:8001/api/comments/accept/${commentID}`,
      "POST"
    );
    if (error) {
      const errorMessage = error.message || "server error";
      toast.error(`Error: Comment cannot confirm`, {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      getAllComments();
      toast.success("Comment confirm successfully", {
        position: "bottom-left",
        autoClose: 3000,
      });
    }

    setIsShowAcceptModal(false);
  };
  const rejectModalSubmitAction = async () => {
    const { error, data } = await authFetch(
      `http://localhost:8001/api/comments/reject/${commentID}`,
      "POST"
    );
    if (error) {
      const errorMessage = error.message || "server error";
      toast.error(`Error: Comment cannot reject`, {
        position: "bottom-left",
        autoClose: 3000,
      });
    } else {
      getAllComments();
      toast.success("Comment reject successfully", {
        position: "bottom-left",
        autoClose: 3000,
      });
    }

    setIsShowRejectModal(false);
  };

  return (
    <>
      <div className="p-4 overflow-x-hidden">
        <h4 className="text-2xl font-medium my-4">Comment list</h4>
        <select
          className="border px-2 py-1 rounded mb-4 outline-gray-500 text-zinc-800 text-sm md:text-base"
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="accepted">Accepted First</option>
          <option value="rejected">Rejected First</option>
        </select>

        <table className="table-fixed w-full bg-white rounded-2xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Customer
              </th>
              <th className="px-4 py-2 text-center hidden sm:table-cell text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 sm:w-1/5">
                product
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Comment
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Date
              </th>
              <th className="px-4 py-2 hidden sm:table-cell text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Hour
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5 lg:w-4/6 xl:w-1/2">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {sortedComments.length ? (
              sortedComments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="text-center px-4 py-2 text-gray-800 whitespace-nowrap text-sm sm:text-base">
                    {comment.userID}
                  </td>
                  <td className="text-center hidden sm:table-cell px-4 py-2">
                    <p className="flex flex-wrap text-xs sm:text-sm md:text-xs lg:text-sm line-clamp-1 max-w-[150px]">
                      {comment.productID}
                    </p>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center flex-col">
                      <button
                        className="seen-btn"
                        onClick={() => {
                          setIsShowDetailsModal(true);
                          setCommentID(comment.id);
                          setMainCommentInfo(comment.body);
                        }}
                      >
                        <FaEye className="sm:hidden" />
                        <span className="hidden sm:inline">Seen</span>
                      </button>
                    </div>
                  </td>
                  <td className="text-center px-4 py-2 text-gray-800 text-xs sm:text-sm">
                    {comment.date}
                  </td>
                  <td className="text-center hidden sm:table-cell px-4 py-2 text-gray-800 text-xs sm:text-sm">
                    {comment.hour}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setIsShowEditModal(true);
                          setCommentID(comment.id);
                          setNewCommentBody(comment.body);
                        }}
                      >
                        <FaEdit className="sm:hidden" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          setIsShowDeleteModal(true);
                          setCommentID(comment.id);
                        }}
                      >
                        <FaTrash className="sm:hidden" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                      <button className="replay-btn">
                        <FaReply className="sm:hidden" />
                        <span className="hidden sm:inline">Replay</span>
                      </button>
                      {comment.isAccept ? (
                        <button
                          className="delete-btn bg-orange-500 hover:bg-orange-600"
                          onClick={() => {
                            setIsShowRejectModal(true);
                            setCommentID(comment.id);
                          }}
                        >
                          <FaTimes className="sm:hidden" />
                          <span className="hidden sm:inline">Reject</span>
                        </button>
                      ) : (
                        <button
                          className="confirm-btn"
                          onClick={() => {
                            setIsShowAcceptModal(true);
                            setCommentID(comment.id);
                          }}
                        >
                          <FaCheck className="sm:hidden" />
                          <span className="hidden sm:inline">Confirm</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <ErrorBox msg="Oops! No comments to display." colCount={6} />
            )}
          </tbody>
        </table>
      </div>
      {isShowDetailsModal && (
        <DetailsModal onHide={closeDetailsModal}>
          <p className="p-5 text-sm md:text-base mb-7">{mainCommentInfo}</p>
          <button className="btn-blue" onClick={closeDetailsModal}>
            Close
          </button>
        </DetailsModal>
      )}
      {isShowEditModal && (
        <EditModal
          onClose={() => setIsShowEditModal(false)}
          onSubmit={(e) => updateCommentInfo(e)}
          title="Please edit the Comment"
        >
          <textarea
            className="text-sm overflow-y-scroll min-h-24 w-full p-2 outline-0  border-t-[0.7px] border-t-gray-500"
            value={newCommentBody}
            onChange={(e) => setNewCommentBody(e.target.value)}
          >
            {newCommentBody}
          </textarea>
        </EditModal>
      )}
      {isShowDeleteModal && (
        <DeleteModal
          cancelAction={() => setIsShowDeleteModal(false)}
          submitAction={deleteModalSubmitAction}
          title="Are you sure for delete this comment ?"
        />
      )}
      {isShowAcceptModal && (
        <DeleteModal
          cancelAction={() => setIsShowAcceptModal(false)}
          submitAction={acceptModalSubmitAction}
          title="Are you sure for confirm this comment ?"
        />
      )}
      {isShowRejectModal && (
        <DeleteModal
          cancelAction={() => setIsShowRejectModal(false)}
          submitAction={rejectModalSubmitAction}
          title="Are you sure for confirm this comment ?"
        />
      )}
    </>
  );
}

export default Comments;
