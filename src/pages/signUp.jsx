import PropTypes from "prop-types";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";
import { instance } from "../utils/useRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

function SignUp() {
  const [postUser, setPostUser] = useState({
    newUserName: "",
    newUserEmail: "",
    newUserPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = (e) => {
    const { value, name } = e.target;
    setPostUser((prev) => ({ ...prev, [name]: value }));
  };

  const SignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Basic client-side validation
      if (!postUser.newUserName || !postUser.newUserEmail || !postUser.newUserPassword) {
        throw new Error("All fields are required");
      }
      
      const response = await instance.post("/signup", postUser);
      
      if (response.data?.status === "ok") {
        toast({
          title: "Welcome aboard!",
          description: "Your digital planning journey begins now.",
          className: "bg-green-100 border-green-500 text-green-800",
        });
        navigate("/login");
      } else {
        throw new Error(response.data?.message || "Signup failed");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong.",
        description: err.response?.data?.message || err.message || "Please try again or contact support.",
      });
      // Only clear the password field on error
      setPostUser(prev => ({...prev, newUserPassword: ""}));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-[url('../assets/planner-background.jpg')] bg-cover bg-center">
      <form
        onSubmit={SignUp}
        className="flex gap-8 flex-col w-1/2 max-w-md mx-auto bg-white bg-opacity-90 backdrop-filter backdrop-blur-md p-10 rounded-3xl shadow-lg"
      >
        <div className="text-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-pink-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Start Planning Today</h1>
          <p className="text-gray-600 mt-2">Sign up for your digital planner</p>
        </div>
        <div className="relative">
          <FontAwesomeIcon icon={faUser} className="absolute top-3 left-3 text-gray-400" />
          <Input
            name="newUserName"
            placeholder="Username"
            type="text"
            value={postUser.newUserName}
            onChange={handleSignUp}
            className="pl-10 border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200"
          />
        </div>
        <div className="relative">
          <FontAwesomeIcon icon={faEnvelope} className="absolute top-3 left-3 text-gray-400" />
          <Input
            name="newUserEmail"
            placeholder="Email"
            type="email"
            value={postUser.newUserEmail}
            onChange={handleSignUp}
            className="pl-10 border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200"
          />
        </div>
        <div className="relative">
          <FontAwesomeIcon icon={faLock} className="absolute top-3 left-3 text-gray-400" />
          <Input
            name="newUserPassword"
            placeholder="Password"
            type="password"
            value={postUser.newUserPassword}
            onChange={handleSignUp}
            className="pl-10 border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200 transition duration-200"
          />
        </div>
        <Button 
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-full hover:from-pink-600 hover:to-purple-700 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-500 hover:text-pink-700 transition duration-200">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
SignUp.propTypes = {
  setIsLogged: PropTypes.func,
};
