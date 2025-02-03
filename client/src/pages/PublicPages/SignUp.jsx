import { Button, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import OAuth from "../../components/OAuth.jsx";
import {
  dispatchError,
  dispatchStopLoading,
  dispatchSuccess,
} from "../../actions/notifications.action.js";
import { userSingUp } from "../../actions/auth.action.js";
import { primary_gradient } from "../../utils/commonConstants.js";

export default function SignUp() {
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatchStopLoading();
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return dispatchError("Please fill out all the fields");
    }

    const signUpSuccess = () => {
      setTimeout(() => navigate("/sign-in"), 4000);
      return dispatchSuccess("Sign up success. Redirecting to sign in page");
    };

    userSingUp(formData, signUpSuccess);
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1 mx-auto items-center">
          <Link to="/">
            <img
              src="./logo-portrait.png"
              className="md:h-72 md:w-72 h-52 w-52"
            />
          </Link>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Name" />
              <TextInput
                type="text"
                placeholder="Name"
                id="name"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="E-mail"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Passoword" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button className={primary_gradient} type="submit">
              Sign Up
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account ?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
