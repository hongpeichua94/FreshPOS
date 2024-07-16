import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

// ANT DESIGN
import { Button } from "antd";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [isLoading, setIsLoading] = useState(false);
  const [accCreated, setAccCreated] = useState(false);
  const [allFields, setAllFields] = useState(false);
  const [error, setError] = useState("");

  const createAccount = async () => {
    const confirmCreate = confirm(
      "Are you sure all fields are entered correctly?"
    );

    if (!confirmCreate) {
      return; // Do nothing if user cancels
    }

    const emailCheck = emailRef.current?.value;
    const passwordCheck = passwordRef.current?.value;
    setIsLoading(true);
    setError("");
    if (!emailCheck || !passwordCheck) {
      setAllFields(true);
      setIsLoading(false);
      throw new Error("Please fill in all required fields");
    }

    try {
      const res = await fetchData("/auth/register", "PUT", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      if (res.ok) {
        setAccCreated(true);
        setAllFields(false);
        setIsLoading(false);
        props.setShowCreateAccountModal(false);
        alert("Account Created");
      } else {
        setError(JSON.stringify(res.data));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating new employee", error);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h4 className="modal-title">Create Account</h4>
        </div>

        <div className={styles.body}>
          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-3">Email</div>
            <input ref={emailRef} type="text" className="col-md-6" />
            <div className="col-md-3"></div>
          </div>

          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-3">Password</div>
            <input ref={passwordRef} type="text" className="col-md-6" />
            <div className="col-md-2"></div>
          </div>
        </div>
        <br />
        <div className={`row ${styles.footer}`}>
          <div className="col-md-12 d-flex justify-content-center">
            <Button onClick={() => props.setShowCreateAccountModal(false)}>
              Close
            </Button>
            <Button type="primary" onClick={createAccount}>
              Save changes
            </Button>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};

const CreateAccountModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay setShowCreateAccountModal={props.setShowCreateAccountModal} />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default CreateAccountModal;
