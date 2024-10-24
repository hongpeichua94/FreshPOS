import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

// ANT DESIGN
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";

// MODULE CSS
import styles from "./Modal.module.css";

const OverLay = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  // const imageRef = useRef("");
  // const nameRef = useRef("");
  // const descriptionRef = useRef("");
  // const priceRef = useRef("");
  // const quantityRef = useRef("");

  const [isLoading, setIsLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [allFields, setAllFields] = useState(false);
  const [fileList, setFileList] = useState({});
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  const { Option } = Select;
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e.slice(-1); // Keep only the last file (single file upload)
    }
    return e?.fileList.slice(-1); // Ensure that only the last file is kept
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    addInventory(values);
  };

  const addInventory = async (values) => {
    const confirmUpdate = confirm(
      "Are you sure you want to proceed to add fruit to inventory?"
    );

    if (!confirmUpdate) {
      return; // Do nothing if user cancels
    }

    const { name, description, image, price, quantity } = values;

    if (!name || !description || !image || !price || !quantity) {
      setAllFields(true);
      setIsLoading(false);
      throw new Error("Please fill in all required fields");
    }

    console.log("File to be uploaded:", image[0].originFileObj);

    try {
      // Create FormData object
      const formData = new FormData();

      // Append file data
      formData.append("file", image[0].originFileObj); // Get the file from the upload field

      // Append text data
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);

      const res = await fetchData(
        `/api/fruit/add`,
        "POST",
        formData,
        // {
        //   name: nameRef.current.value,
        //   image_url: imageRef.current.value,
        //   description: descriptionRef.current.value,
        //   price: priceRef.current.value,
        //   quantity: quantityRef.current.value,
        // },
        userCtx.accessToken
      );

      if (res.ok) {
        setFileUploaded(true);
        setAllFields(false);
        setIsLoading(false);
        message.success("New fruit added successfully!");
        props.fetchInventoryData();
        props.setShowInventoryAddModal(false);
      } else {
        alert(JSON.stringify(res.data));
        console.log(res.data);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred during add inventory");
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h4 className="modal-title">Add inventory</h4>
          <Button
            className={styles.closeButton}
            onClick={() => props.setShowInventoryAddModal(false)}
            icon={<CloseOutlined />}
            type="text"
          />
        </div>

        <Form
          form={form}
          encType="multipart/form-data"
          name="validate_other"
          {...formItemLayout}
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter fruit name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please enter a description!",
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload
              name="file"
              accept="image/*"
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              {
                required: true,
                message: "Please enter a price!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              {
                required: true,
                message: "Please enter a quantity!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="reset">reset</Button>
            </Space>
          </Form.Item>
        </Form>

        {/* <div className={styles.body}>
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
        </div> */}
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
