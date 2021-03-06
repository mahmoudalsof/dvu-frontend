import React, { useEffect, useState } from "react";
import MemberDashboardMenu from "../../../components/dashboard-menu/members";
import Layout from "../../../components/layout";
import QrCode from "qrcode.react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { MdPersonOutline } from "react-icons/md";
import {
  AiOutlineMail,
  AiOutlineMobile,
  AiOutlineWhatsApp,
  AiOutlineCar,
} from "react-icons/ai";
import SectionHeader from "../../../components/section-header";
import { useHistory } from "react-router-dom";
import Seo from "../../../components/seo";
const MemberDashboard_Profile = () => {
  const currentUser = useStoreState((state) => state.currentUser.currentUser);
  const setCurrentUser = useStoreActions(
    (actions) => actions.currentUser.setCurrentUser
  );
  const [isBarcodeZoomedIn, setIsBarcodeZoomedIn] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const history = useHistory();

  const handleLogout = () => {
    try {
      localStorage.clear();
      history.push("/members/login");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.push("/members/login");
    }

    if (Object.keys(currentUser).length === 0) {
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
      setIsDataLoaded(true);
    }

    setIsDataLoaded(true);
  });

  return (
    <Layout>
      <div className="container flex flex-col space-y-6 bg-darkGray p-5 rounded-lg mx-auto max-w-md ">
        <Seo title="Profile" />
        <SectionHeader
          heading="Profile"
          buttonLabel="Logout"
          handleButtonOnClick={handleLogout}
        />

        {isDataLoaded ? (
          <>
            {isBarcodeZoomedIn ? (
              <>
                <div className="self-center bg-white p-2 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <QrCode
                    className="self-center"
                    size={300}
                    bgColor="white"
                    fgColor="black"
                    value={currentUser.id}
                    onClick={() => setIsBarcodeZoomedIn(!isBarcodeZoomedIn)}
                  />
                </div>
                <div className="self-center bg-darkGray p-2">
                  <QrCode
                    className="self-center"
                    size={200}
                    bgColor="#2f2f37"
                    fgColor="#2f2f37"
                    value={currentUser.id}
                    onClick={() => setIsBarcodeZoomedIn(!isBarcodeZoomedIn)}
                  />
                </div>
              </>
            ) : (
              <div className="self-center bg-white p-2">
                <QrCode
                  className="self-center"
                  size={200}
                  bgColor="white"
                  fgColor="black"
                  value={currentUser.id}
                  onClick={() => setIsBarcodeZoomedIn(!isBarcodeZoomedIn)}
                />
              </div>
            )}

            <div className="border-red border-2 rounded p-5 flex flex-col space-y-3 w-full">
              <div className="mb-2">
                {currentUser.roles.some(
                  (_role) =>
                    _role.name === "WOLFSBURG" || _role.name === "ADMIN"
                ) ? (
                  currentUser.roles.map((_role, index) =>
                    _role.name !== "ACTIVE" ? (
                      <p
                        key={index}
                        className="text-red font-bold text-center text-2xl uppercase"
                      >
                        {_role.name}
                      </p>
                    ) : null
                  )
                ) : (
                  <p className="text-green font-bold text-center text-2xl uppercase">
                    Active
                  </p>
                )}
              </div>
              <div className="flex flex-row">
                <MdPersonOutline className="text-red text-2xl" />
                <p className="text-white ml-6">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
              </div>
              <div className="flex flex-row">
                <AiOutlineMail className="text-red text-2xl" />
                <p className="text-white ml-6">{currentUser.emailAddress}</p>
              </div>
              <div className="flex flex-row">
                <AiOutlineMobile className="text-red text-2xl" />
                <p className="text-white ml-6">{currentUser.mobileNumber}</p>
              </div>
              <div className="flex flex-row">
                <AiOutlineWhatsApp className="text-red text-2xl" />
                <p className="text-white ml-6">{currentUser.whatsAppNumber}</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row space-x-4 text-left mb-3">
                <AiOutlineCar className="text-red text-3xl" />
                <p className="text-white text-xl">
                  {currentUser.cars.length > 1 ? "Cars" : "Car"}
                </p>
              </div>

              {currentUser.cars.map((_car, index) => (
                <div
                  className="flex flex-col bg-charcoal p-4 rounded-md "
                  key={index}
                >
                  <div className="text-white ">
                    <p>
                      {_car.carYear} {_car.carModel} {_car.carColor}
                    </p>
                  </div>
                  <div className="text-white ">
                    <p>
                      {_car.plateEmirate} {_car.plateCode} {_car.plateNumber}
                    </p>
                  </div>
                  <div className="text-white ">
                    <p>{_car.vinNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
      <div className="p-10 ">
        <MemberDashboardMenu />
      </div>
    </Layout>
  );
};

export default MemberDashboard_Profile;
