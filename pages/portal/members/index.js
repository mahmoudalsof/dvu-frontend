import React, { useState, useEffect } from "react";
import Layout from "../../../src/components/layout";
import Link from "next/link";
import CustomButton from "../../../src/components/custom-button";
import InputField from "../../../src/components/input-field";
import { useStoreState, useStoreActions } from "easy-peasy";
import axios from "axios";
import { useRouter } from "next/router";
import loginValidator from "../../../src/validators/login-validator";

const MembersLoginPage = () => {
  const [errorMessages, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const formData = useStoreState((state) => state.memberLoginForm.formData);
  const setFormData = useStoreActions(
    (actions) => actions.memberLoginForm.setFormData
  );

  const setCurrentUser = useStoreActions(
    (actions) => actions.currentUser.setCurrentUser
  );
  const router = useRouter();

  const handleFormChange = (e) => {
    setFormData(e.target);
    setValidationErrors({
      ...validationErrors,
      [e.target.name]: null,
    });
  };

  const handleSubmit = (e) => {
    try {
      e.preventDefault();

      loginValidator
        .validate(formData, { abortEarly: false })
        .then(async () => {
          console.log(process.env.NEXT_PUBLIC_API_URL);
          const _response = await axios.post("/auth/login", formData);

          if (_response.status === 200) {
            const { _token, _member } = _response.data;

            if (!_member.roles.some((_role) => _role.name === "ACTIVE")) {
              setErrorMessage(
                "Your account has not been activated or you have been purged"
              );
              return;
            } else {
              localStorage.setItem("token", _token);

              if (_member.roles.some((_role) => _role.name === "ADMIN")) {
                localStorage.setItem("isAdmin", true);
              }
              setCurrentUser(_member);
              if (_member.firstLogin) {
                router.push(
                  {
                    pathname: "/portal/members/update-password",
                    query: {
                      id: _member.id,
                    },
                  },
                  "/members/update-password"
                );
              } else {
                router.push("/dashboard/members");
              }
            }
          } else if (_response.status === 401) {
          }
        })
        .catch((err) => {
          if (err && err.inner) {
            let _validationErrors = {};
            err.inner.forEach((e) => {
              _validationErrors[e.path] = e.message;
            });

            setValidationErrors(_validationErrors);
          } else if (err.response) {
            setErrorMessage(err.response.data.err);
          }
        });
    } catch (err) {
      setErrorMessage(err.response.data.err);
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.get("/auth/verify-token").then((_response) => {
          if (_response.status === 200) {
            setCurrentUser(_response.data._member);
            router.push("/dashboard/members");
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [setCurrentUser, router]);

  return (
    <Layout>
      <div className="container flex flex-col items-center space-y-6 bg-darkGray p-5 rounded-lg mx-auto max-w-md ">
        <h6 className="text-white uppercase font-bold tracking-widest text-xl">
          Members Login
        </h6>
        <form className="space-y-10">
          <div>
            <InputField
              placeholder="Email Address"
              type="email"
              name="emailAddress"
              handleInputChange={(e) => handleFormChange(e)}
              styleType={2}
              required
            />
            {validationErrors.emailAddress ? (
              <p className="text-red text-sm">
                {validationErrors.emailAddress}
              </p>
            ) : null}
          </div>
          <div>
            <InputField
              placeholder="Password"
              name="password"
              handleInputChange={(e) => handleFormChange(e)}
              type="password"
              styleType={2}
              required
            />
            {validationErrors.password ? (
              <p className="text-red text-sm">{validationErrors.password}</p>
            ) : null}
          </div>
          {errorMessages ? (
            <p className="text-center text-sm text-red font-bold">
              ERROR !{" "}
              <span className="font-normal text-white">{errorMessages}</span>
            </p>
          ) : null}
          <CustomButton
            label="Login"
            link="/members/dashboard"
            handleOnClick={handleSubmit}
            extraClasses="w-full mt-10"
          />
          <p className="text-white">
            Forgot your password?
            <Link href="/portal/members/reset-password">
              <span className="ml-1 text-red font-bold cursor-pointer">
                Click here
              </span>
            </Link>
          </p>
          <p className="text-white">
            Not a member yet?{" "}
            <Link href="/portal/members/sign-up">
              <span className="ml-1 text-red font-bold cursor-pointer">
                Click here
              </span>
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default MembersLoginPage;