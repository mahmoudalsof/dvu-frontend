import React, { useState } from "react";
import MemberDashboardMenu from "../../../../components/dashboard-menu/members";
import Layout from "../../../../components/layout";
import { useHistory } from "react-router-dom";
import InputField from "../../../../components/input-field";
import CustomButton from "../../../../components/custom-button";
import CustomEditor from "../../../../components/custom-editor";
import CustomDatePicker from "../../../../components/custom-date-picker";
import CustomTimePicker from "../../../../components/custom-time-picker";

const AdminTab_Events_Add = () => {
  const [formData, setFormData] = useState({});
  const history = useHistory();

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData({
      ...formData,
      details: data,
    });
  };

  const handleFormChange = (e) => {
    const { id, name, value } = e.target;
    setFormData({
      ...formData,
      [name || id]: value,
    });
  };

  const handleOnClick = () => {
    console.log(formData);
    history.push("/admin/events");
  };

  const handleDatePicker = (date) => {
    setFormData({
      ...formData,
      date: date,
    });
  };

  const handleTimePicker = (time) => {
    setFormData({
      ...formData,
      meetingTime: time,
    });
  };

  return (
    <Layout>
      <div className="container flex flex-col items-center space-y-6 bg-darkGray p-5 rounded-lg mx-auto max-w-md h-screen">
        <h6 className="text-white uppercase font-bold tracking-widest text-xl">
          Admin
        </h6>
        <p className="text-white">Add Event</p>
        <InputField
          placeholder="Name"
          name="name"
          required
          type="text"
          handleInputChange={handleFormChange}
        />
        <CustomDatePicker
          selected={formData.date}
          handleDateChange={handleDatePicker}
          placeHolder="Date"
          id="date"
        />
        <InputField
          placeholder="Meeting Point"
          name="meetingPoint"
          required
          type="text"
          handleInputChange={handleFormChange}
        />
        <CustomTimePicker
          placeHolder="Meeting Time"
          selected={formData.meetingTime}
          handleTimeChange={handleTimePicker}
        />
        <div className="w-full ckeditor_list">
          <CustomEditor
            handleOnChange={(e, editor) => handleEditorChange(e, editor)}
          />
        </div>
        <CustomButton label="Edit" handleOnClick={handleOnClick} />
      </div>
      <div className="p-10 ">
        <MemberDashboardMenu />
      </div>
    </Layout>
  );
};

export default AdminTab_Events_Add;
