import React, { createContext, useContext, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    show: false,
    message: '',
    resolve: null,
  });

  const confirm = (message = "Silmeden önce emin misiniz?") => {
    return new Promise((resolve) => {
      setConfirmState({ show: true, message, resolve });
    });
  };

  const handleConfirm = () => {
    if (confirmState.resolve) confirmState.resolve(true);
    setConfirmState({ ...confirmState, show: false, resolve: null });
  };

  const handleCancel = () => {
    if (confirmState.resolve) confirmState.resolve(false);
    setConfirmState({ ...confirmState, show: false, resolve: null });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Modal show={confirmState.show} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Onay</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmState.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>Hayır</Button>
          <Button variant="danger" onClick={handleConfirm}>Evet</Button>
        </Modal.Footer>
      </Modal>
    </ConfirmContext.Provider>
  );
};
