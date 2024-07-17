import React, { useContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

// ANT DESIGN
import { Button } from "antd";

// MODULE CSS
import styles from "./Modal.module.css";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const phoneRef = useRef("");
  const emailRef = useRef("");

  const updateProfile = async (userId) => {
    const confirmUpdate = confirm(
      "Are you sure you want to proceed to update profile details?"
    );

    if (!confirmUpdate) {
      return; // Do nothing if user cancels
    }

    const res = await fetchData(
      `/api/user/${userId}`,
      "PATCH",
      {
        first_name: firstNameRef.current.value,
        last_name: lastNameRef.current.value,
        phone: phoneRef.current.value,
        email: emailRef.current.value,
      },
      userCtx.accessToken
    );

    if (res.ok) {
      alert(`Profile updated successfully!`);
      props.fetchUserDetails(userId);
      props.setShowProfileUpdateModal(false);
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
    }
  };

  useEffect(() => {
    firstNameRef.current.value = props.firstName;
    lastNameRef.current.value = props.lastName;
    phoneRef.current.value = props.phone;
    emailRef.current.value = props.email;
  }, []);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h4 className="modal-title">Update profile</h4>
        </div>

        <div className={styles.body}>
          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-3">First Name</div>
            <input ref={firstNameRef} type="text" className="col-md-6" />
            <div className="col-md-3"></div>
          </div>

          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-3">Last Name</div>
            <input ref={lastNameRef} type="text" className="col-md-6" />
            <div className="col-md-3"></div>
          </div>

          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-3">Phone</div>
            <input ref={phoneRef} type="text" className="col-md-6" />
            <div className="col-md-3"></div>
          </div>

          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-3">Email</div>
            <input ref={emailRef} type="text" className="col-md-6" />
            <div className="col-md-3"></div>
          </div>
        </div>
        <br />
        <div className={`row ${styles.footer}`}>
          <div className="col-md-12 d-flex justify-content-center">
            <Button onClick={() => props.setShowProfileUpdateModal(false)}>
              Close
            </Button>
            <Button type="primary" onClick={() => updateProfile(props.id)}>
              Save changes
            </Button>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};

const UpdateProfileModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          id={props.id}
          status={props.status}
          firstName={props.firstName}
          lastName={props.lastName}
          email={props.email}
          phone={props.phone}
          setShowProfileUpdateModal={props.setShowProfileUpdateModal}
          fetchUserDetails={props.fetchUserDetails}
        />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default UpdateProfileModal;
