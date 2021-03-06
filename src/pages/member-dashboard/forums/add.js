import React, { useEffect, useState } from "react";
import CustomButton from "../../../components/custom-button";
import InputField from "../../../components/input-field";
import Layout from "../../../components/layout";
import SectionHeader from "../../../components/section-header";
import TextArea from "../../../components/text-area";
import axios from "axios";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useHistory } from "react-router-dom";
import { addPost } from "../../../validators/forums-validator";
import Seo from "../../../components/seo";
import CustomEditor from "../../../components/custom-editor";
const MemberDashboard_Forums_Add = () => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const history = useHistory();

  const currentUser = useStoreState((state) => state.currentUser.currentUser);
  const setCurrentUser = useStoreActions(
    (actions) => actions.currentUser.setCurrentUser
  );

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.push("/members/login");
    }

    if (Object.keys(currentUser).length === 0) {
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
    }
  });

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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

  const handleAddNewPost = async () => {
    try {
      addPost
        .validate(formData, { abortEarly: false })
        .then(async () => {
          const { title, description } = formData;

          let body = {
            memberId: currentUser.id,
            title,
            description,
          };

          const _response = await axios.post("/posts", body);

          if (_response.status === 200) {
            history.push("/forums");
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
      <div className="container flex flex-col space-y-6 bg-darkGray p-5 rounded-lg mx-auto max-w-md">
        <Seo title="Add Post" />
        <SectionHeader
          heading="Forums"
          backLink="/forums"
          subHeading="Post your Question"
        />
        <div className="w-full flex flex-col space-y-5">
          <InputField
            placeholder="Title or Subject"
            styleType={2}
            type="text"
            required
            name="title"
            handleInputChange={handleFormChange}
            errorMessage={validationErrors.title}
          />
          {/* <TextArea
            rows={5}
            placeholder="Your question"
            name="description"
            required
            handleInputChange={handleFormChange}
            errorMessage={validationErrors.description}
          /> */}
          <div>
            <CustomEditor
              placeholder="Your question"
              handleOnChange={handleEditorChange}
            />
            {validationErrors.description ? (
              <p className="text-red text-sm mt-1">
                {validationErrors.description}
              </p>
            ) : null}
          </div>
          {/* <DropdownField
              handleInputChange={handleFormChange}
              options={categories}
              placeholder="Category"
              name="categoryName"
              required
              styleType={2}
            /> */}
          <CustomButton
            styleType={2}
            label="Post"
            handleOnClick={handleAddNewPost}
          />
        </div>
      </div>
    </Layout>
  );
};

export default MemberDashboard_Forums_Add;
