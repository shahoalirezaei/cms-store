
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function DetailsModal({ onHide, children }) {
  useEffect(() => {
    const checkKey = (event) => {
      if (event.key === 'Escape') {
        onHide();
      }
    };
    window.addEventListener('keydown', checkKey);
    return () => window.removeEventListener('keydown', checkKey);

    
  }, [onHide]);

  const handleOverlayClick = () => {
    onHide();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <div
      className="modal-parent"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full md:w-3/4 mx-4 p-8 bg-white rounded-2xl text-base sm:text-2xl mt-10"
        onClick={handleContentClick}
      >
        {children}
      </div>
        <div className='bg-red-400 text-black text-sm text-center py-2 px-8 mt-auto ml-auto mb-5 rounded-2xl '>
          <span>please press Escape or click overlay to hide modal</span>
        </div>
    </div>,
    document.getElementById('modal-parent')
  );
}

export default DetailsModal;
