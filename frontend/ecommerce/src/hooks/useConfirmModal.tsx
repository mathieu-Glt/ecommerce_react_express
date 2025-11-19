import { useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";

export function useConfirmModal() {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState<string>("Confirmation");
  const [message, setMessage] = useState<string>("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  const confirm = useCallback(
    (titleText: string, messageText: string, onConfirmCallback: () => void) => {
      setTitle(titleText);
      setMessage(messageText);
      setOnConfirm(() => onConfirmCallback);
      setShow(true);
    },
    []
  );

  const ConfirmModal = useCallback(() => {
    return (
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShow(false);
              onConfirm();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }, [show, title, message, onConfirm]);

  return { confirm, ConfirmModal };
}
