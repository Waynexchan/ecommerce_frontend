import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function Payment() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container mt-5">
      <h1>Payment Methods</h1>
      <Button variant="primary" onClick={handleShow}>
        View Payment and Return Policy
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>付款方式及退貨政策</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>付款方式 Payment Methods</h5>
          <ul>
            <li>付款方式：轉數快/銀行轉帳/Stripe</li>
            <li>Payment Methods: FPS/Bank Transfer/Stripe</li>
          </ul>
          <h5>退貨及退款政策 Return and Refund Policy</h5>
          <h6>⚠️ 注意事項 Important Notice</h6>
          <ul>
            <li>所有圖片只供參考，一切均以實物為準。</li>
            <li>All images are for reference only. Actual color and size may vary.</li>
            <li>如一個月內未能完成購買之貨品，會盡快退回訂金。</li>
            <li>If for any reason the purchase cannot be completed, the deposit will be refunded as soon as possible.</li>
            <li>所有貨品均為正貨, 貨物出門恕不退換。</li>
            <li>All goods are non-refundable once they leave the store.</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Payment;
