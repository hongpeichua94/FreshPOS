import React, { useContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

// ANT DESIGN
import { Button, message } from "antd";

// MODULE CSS
import styles from "./Modal.module.css";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const imageRef = useRef("");
  const nameRef = useRef("");
  const descriptionRef = useRef("");
  const priceRef = useRef("");
  const quantityRef = useRef("");

  const addInventory = async () => {
    const confirmUpdate = confirm(
      "Are you sure you want to proceed to add fruit to inventory?"
    );

    if (!confirmUpdate) {
      return; // Do nothing if user cancels
    }

    const res = await fetchData(
      `/api/fruit/add`,
      "PUT",
      {
        name: nameRef.current.value,
        image_url: imageRef.current.value,
        description: descriptionRef.current.value,
        price: priceRef.current.value,
        quantity: quantityRef.current.value,
      },
      userCtx.accessToken
    );

    if (res.ok) {
      message.success("Inventory updated successfully!");
      props.fetchInventoryData();
      props.setShowInventoryAddModal(false);
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
    }
  };
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h4 className="modal-title">Add inventory</h4>
        </div>

        <div className={styles.body}>
          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-3">Fruit</div>
            <input ref={nameRef} type="text" className="col-md-6" />
            <div className="col-md-3"></div>
          </div>

          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-3">Image</div>
            <input ref={imageRef} type="text" className="col-md-6" />
            <div className="col-md-3"></div>
          </div>

          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-3">Description</div>
            <input ref={descriptionRef} type="text" className="col-md-6" />
            <div className="col-md-3"></div>
          </div>

          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-3">Price</div>
            <input ref={priceRef} type="text" className="col-md-6" />
            <div className="col-md-3"></div>
          </div>

          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-3">Quantity</div>
            <input ref={quantityRef} type="text" className="col-md-6" />
            <div className="col-md-3"></div>
          </div>
        </div>
        <br />
        <div className={`row ${styles.footer}`}>
          <div className="col-md-12 d-flex justify-content-center">
            <Button onClick={() => props.setShowInventoryAddModal(false)}>
              Close
            </Button>
            <Button type="primary" onClick={() => addInventory()}>
              Save changes
            </Button>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};

const AddInventoryModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          setShowInventoryAddModal={props.setShowInventoryAddModal}
          fetchInventoryData={props.fetchInventoryData}
        />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default AddInventoryModal;
