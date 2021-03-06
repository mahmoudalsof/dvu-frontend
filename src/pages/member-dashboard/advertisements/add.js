import axios from "axios";
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";
import CustomButton from "../../../components/custom-button";
import CustomEditor from "../../../components/custom-editor";
import InputField from "../../../components/input-field";
import Layout from "../../../components/layout";
import SectionHeader from "../../../components/section-header";
import { addAdvertisement } from "../../../validators/advertisements-validator";
import { useHistory } from "react-router-dom";
import Seo from "../../../components/seo";

const MemberDashboard_Advertisements_Add = () => {
  const currentUser = useStoreState((state) => state.currentUser.currentUser);
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.push("/members/login");
    }
  });

  const handleFormChange = (e) => {
    const { value, name } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    setValidationErrors({
      ...validationErrors,
      [name]: null,
    });
  };

  const handleFileUpload = (e) => {
    setFormData({
      ...formData,
      imageFile: e.target.files[0],
    });
    setValidationErrors({
      ...validationErrors,
      imageFile: null,
    });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();

    setFormData({
      ...formData,
      description: data,
    });
    setValidationErrors({
      ...validationErrors,
      description: null,
    });
  };

  const handleSubmit = () => {
    try {
      addAdvertisement
        .validate(formData, { abortEarly: false })
        .then(async () => {
          if (!formData.imageFile) {
            return setValidationErrors({
              ...validationErrors,
              imageFile: "Image is required",
            });
          }

          let _formData = new FormData();
          _formData.append("title", formData.title);
          _formData.append("price", formData.price);
          _formData.append("description", formData.description);
          _formData.append("id", currentUser.id);
          _formData.append("imageFile", formData.imageFile);
          const _response = await axios.post("/advertisements", _formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (_response.status === 200) {
            history.push("/advertisements");
          }
        })
        .catch((err) => {
          if (err && err.inner) {
            let _validationErrors = {};
            err.inner.forEach((e) => {
              _validationErrors[e.path] = e.message;
            });
            setValidationErrors(_validationErrors);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="container flex flex-col space-y-6 bg-darkGray p-5 rounded-lg mx-auto max-w-md ">
        <Seo title="Add Advertisement" />
        <SectionHeader
          heading="Advertisements"
          subHeading="Add new advertisement"
          backLink="/advertisements"
        />
        <div className="space-y-5">
          <InputField
            name="title"
            placeholder="Title"
            styleType={2}
            handleInputChange={handleFormChange}
            errorMessage={validationErrors.title}
          />
          <InputField
            name="price"
            placeholder="Price in AED"
            styleType={2}
            handleInputChange={handleFormChange}
            errorMessage={validationErrors.price}
          />
          <div>
            <CustomEditor
              placeholder="Description"
              handleOnChange={handleEditorChange}
            />
            {validationErrors.description ? (
              <p className="text-red text-sm mt-1">
                {validationErrors.description}
              </p>
            ) : null}
          </div>
          <div>
            <InputField
              name="image"
              placeholder="Image"
              type="file"
              styleType={2}
              handleInputChange={handleFileUpload}
              accept="image/*"
              errorMessage={validationErrors.imageFile}
            />
            <p className="text-white text-sm opacity-60 mt-1">
              Image must be one of the following: JPG, PNG, JPEG
            </p>
          </div>
          <div>
            <p className="text-white opacity-70 leading-8">
              After you submit your ad, please allow some time for an admin to
              ensure your advertisement is safe for publishing. Once it has been
              approved, everyone will be able to see your advertisement.
            </p>
          </div>
          <CustomButton
            label="Submit"
            styleType={2}
            extraClasses="w-full"
            handleOnClick={handleSubmit}
          />
        </div>
      </div>
    </Layout>
  );
};

export default MemberDashboard_Advertisements_Add;
