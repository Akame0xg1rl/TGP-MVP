import PropTypes from "prop-types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";
import { instance } from "../utils/useRequest";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

function Login({ setIsLogged }) {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async () => {
    setIsLoading(true);
    try {
      const data = await instance.post("/login", formData);
      if (data?.data?.user) {
        localStorage.setItem("access_token", data.data?.user);
        setIsLogged(true);
        navigate("/");
        return;
      }
      throw Error();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Oops! Login failed.",
        description: "Please check your email and password.",
      });
      setFormData({
        userEmail: "",
        userPassword: "",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-[url('../assets/planner-background.jpg')] bg-cover bg-center">
      <div className="flex gap-8 flex-col w-1/2 max-w-md mx-auto bg-white bg-opacity-90 backdrop-filter backdrop-blur-md p-10 rounded-3xl shadow-lg">
        <div className="text-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-pink-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Sign in to access your digital planner</p>
        </div>
        <div className="relative">
          <Input
            name="userEmail"
            placeholder="Email"
            type="email"
            value={formData.userEmail}
            onChange={handleChange}
            className="pl-10 border-2 border-pink-300 focus:border-pink-500 rounded-lg"
          />
          <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <Input
            name="userPassword"
            placeholder="Password"
            type="password"
            value={formData.userPassword}
            onChange={handleChange}
            className="pl-10 border-2 border-pink-300 focus:border-pink-500 rounded-lg"
          />
          <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Button
          onClick={onLogin}
          disabled={isLoading}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/signUp" className="text-pink-500 hover:text-pink-600 font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

Login.propTypes = {
  setIsLogged: PropTypes.func,
};
