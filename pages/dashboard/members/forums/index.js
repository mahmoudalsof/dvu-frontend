import React, { useState, useEffect } from "react";
import MemberDashboardMenu from "../../../../src/components/dashboard-menu/members";
import Layout from "../../../../src/components/layout";
import axios from "axios";
import moment from "moment";
import SearchBar from "../../../../src/components/search-bar";
import SectionHeader from "../../../../src/components/section-header";
// import { useHistory } from "react-router-dom";
import { useRouter } from "next/router";
const MemberDashboard_Forums = () => {
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  useEffect(() => {
    try {
      Promise.all([axios.get("/posts")]).then((_responses) => {
        if (_responses[0].status === 200) {
          setPosts(_responses[0].data);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, [setPosts]);

  const handleGoToPost = (id) => {
    // TODO: dynamic route to show post title in the url
    router.push(
      {
        pathname: "/dashboard/members/forums/view",
        query: { id },
      },
      "/dashboard/members/forums/view"
    );
  };

  const handleSearch = async (e) => {
    try {
      const { value } = e.target;

      const _response = await axios.post("/posts/search", {
        searchQuery: value,
      });

      if (_response.status === 200) {
        const { data } = _response;
        setPosts(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="container flex flex-col  space-y-6 bg-darkGray p-5 rounded-lg mx-auto max-w-md ">
        <SectionHeader
          heading="Forums"
          buttonLink="/dashboard/members/forums/new"
          buttonLabel="New"
        />
        <div className="w-full flex flex-col space-y-5">
          <SearchBar handleInputChange={handleSearch} />
          {/* <div className="flex flex-row space-x-3 overflow-x-auto">
            {categories.map((_category, index) =>
              index === activeCategoryIndex ? (
                <button
                  className="bg-red rounded-md px-4 py-1 text-white shadow-md outline-none"
                  key={index}
                  onClick={() => setActiveCategoryIndex(index)}
                >
                  {_category.name}
                </button>
              ) : (
                <button
                  className="bg-charcoal rounded-md px-4 py-1 text-white shadow-md outline-none"
                  key={index}
                  onClick={() => setActiveCategoryIndex(index)}
                >
                  {_category.name}
                </button>
              )
            )}
          </div> */}
          {posts.map((_post, index) => (
            <div
              key={index}
              className="bg-charcoal rounded-md p-4 flex flex-row justify-between shadow-md cursor-pointer "
              onClick={() => handleGoToPost(_post.id)}
            >
              <div className="w-full">
                <p className="text-white">{_post.title}</p>
                <p className="text-red text-sm">
                  {_post.member.firstName} {_post.member.lastName}
                </p>
                <p className="text-white text-xs py-2">
                  {moment(_post.createdAt)
                    .format("hh:mm a - DD MMM YYYY")
                    .toUpperCase()}
                </p>
              </div>
              <div className="w-1/6 flex flex-col self-center bg-red rounded-md shadow-md">
                <p className="text-white text-center">
                  {_post.comments.length}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-10 ">
        <MemberDashboardMenu />
      </div>
    </Layout>
  );
};

export default MemberDashboard_Forums;