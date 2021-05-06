import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomButton from "../../../components/custom-button";
import MemberDashboardMenu from "../../../components/dashboard-menu/members";
import Layout from "../../../components/layout";

const MemberDashboard_Admin = () => {
  const [memberCount, setMemberCount] = useState(0);
  const [inactiveMemberCount, setInactiveMemberCount] = useState(0);
  useEffect(() => {
    try {
      Promise.all([
        axios.get("/utility/member-count"),
        axios.get("/utility/member-count/inactive"),
      ]).then((_responses) => {
        if (_responses[0].status === 200) {
          const { count } = _responses[0].data;
          setMemberCount(count);
        }

        if (_responses[1].status === 200) {
          const { count } = _responses[1].data;
          setInactiveMemberCount(count);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, [setMemberCount, setInactiveMemberCount]);

  return (
    <Layout>
      <div className="container flex flex-col items-center space-y-6 bg-darkGray p-5 rounded-lg mx-auto max-w-md ">
        <h6 className="text-white uppercase font-bold tracking-widest text-xl">
          Admin
        </h6>
        <div className="flex flex-col w-full space-y-2">
          <div className="text-center text-white bg-charcoal rounded-md leading-9 shadow-md ">
            <p className="font-bold">Members</p>
            <p>{memberCount}</p>
          </div>
          <div className="text-center text-white bg-charcoal rounded-md leading-9 shadow-md">
            <p className="font-bold">Pending</p>
            <p>{inactiveMemberCount}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-4 w-full">
          <CustomButton link="/admin/announcements" label="Announcements" />
          <CustomButton label="Events" link="/admin/events" />
          <CustomButton label="Members" link="/admin/members" />
        </div>
      </div>
      <div className="p-10 ">
        <MemberDashboardMenu />
      </div>
    </Layout>
  );
};

export default MemberDashboard_Admin;
