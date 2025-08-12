import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { v4 as uuidv4 } from 'uuid';

const MensagemRetorno = forwardRef((props, ref) => {
  const [toasts, setToasts] = useState([]);

  useImperativeHandle(ref, () => ({
    showToast(msg) {
      const id = uuidv4();
      setToasts((prev) => [...prev, { id, msg }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2000);
    },
  }));

  const styles = {
    toastContainer: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '260px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 9999,
      pointerEvents: 'none',
    },
    toast: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 500,
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      pointerEvents: 'auto',
      userSelect: 'none',
      animation: 'fadeinout 2s forwards',
    },
  };

  return (
    <>
      <div style={styles.toastContainer}>
        {toasts.map(({ id, msg }) => (
          <div key={id} style={styles.toast} className="toast-animation">
            {msg}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes fadeinout {
            0% { opacity: 0; transform: translateY(10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }

          .toast-animation {
            animation: fadeinout 2s forwards;
          }
        `}
      </style>
    </>
  );
});

export default MensagemRetorno;
