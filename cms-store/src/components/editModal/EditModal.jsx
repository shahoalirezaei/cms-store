import React, { useEffect } from 'react'
import ReactDOM from 'react-dom';

function EditModal({ onClose, onSubmit, children, title }) {
  useEffect(() => {
      const checkKey = (event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', checkKey);
      return () => window.removeEventListener('keydown', checkKey);
  
      
    }, [onClose]);

    const handleOverlayClick = () => {
      onClose();
    }
    const handleContentClick = (e) => {
      e.stopPropagation();
    }

  return ReactDOM.createPortal(
    <div className="modal-parent"
    onClick={handleOverlayClick}
    >
      <form action="#" className='w-full max-w-md mx-4 p-8 flex flex-col gap-y-2.5 items-center bg-white rounded-2xl text-base sm:text-2xl mt-40'
        onClick={handleContentClick}
      >
        <h4 className='text-center text-base md:text-xl mb-3'>{title}</h4>
        {children}
        <button className="btn-blue mt-2 w-1/3 " onClick={onSubmit}>Update</button>
      </form>
      <div className='bg-red-400 text-black text-sm text-center py-2 px-8 mt-auto ml-auto mb-5 rounded-2xl '>
          <span>please press Escape or click overlay to hide modal</span>
        </div>
    </div>,
    document.getElementById('modal-parent')
  )



}

export default EditModal