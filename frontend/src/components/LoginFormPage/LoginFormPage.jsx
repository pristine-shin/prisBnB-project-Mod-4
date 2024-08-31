import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/session";
import { Navigate } from "react-router-dom";
import './LoginForm.css'

const LoginFormPage = () => {
  const dispatch = useDispatch();
  const currUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if(currUser) return <Navigate to='/' replace={true} />

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = {
      credential,
      password,
    };
    return dispatch(login(userInfo)).catch(async (res) => {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    });
  };

  return (
    <div className="log-in-container">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>Username or Email
            <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            />
        </label>
        <label>Password
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginFormPage;
