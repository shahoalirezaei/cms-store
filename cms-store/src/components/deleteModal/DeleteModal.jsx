import React, { useEffect } from "react";
import ReactDom from "react-dom";

function DeleteModal({ cancelAction, submitAction, title }) {

  return ReactDom.createPortal(
    <div className="modal-parent" >
      <div
        className="w-full max-w-md flex flex-col bg-white p-5 items-center rounded-2xl mt-10 "
       
      >
        <h4 className="text-center text-xl md:text-2xl mb-8">
          {title}
        </h4>
        <div className="flex w-2/3 gap-x-4 justify-center mt-auto">
          <button className="details-btn flex w-full py-3" onClick={cancelAction}>
            No
          </button>
          <button className="delete-btn flex w-full py-3" onClick={submitAction}>
            Yes
          </button>
        </div>
      </div>
      <div className="bg-red-400 text-black text-sm text-center py-2 px-8 mt-auto ml-auto mb-5 rounded-2xl ">
        <span>please press Escape or click overlay to hide modal</span>
      </div>
    </div>,
    document.getElementById("modal-parent")
  );
}

export default DeleteModal;
