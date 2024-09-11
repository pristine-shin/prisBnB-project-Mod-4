import { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal';
// import { Navigate } from "react-router-dom";
import './LoginForm.css'
import { useNavigate } from "react-router-dom";

const LoginFormModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const currUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // if(currUser) return <Navigate to='/' replace={true} />

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const userInfo = {
      credential,
      password,
    };
    return dispatch(login(userInfo))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    });
  };

  return (
    <div className="login-container">
      <h1 id="heading">Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          placeholder="Username or Email"
          className="form-input"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit" className="login-button">Log In</button>
      </form>
    </div>
  );
};

export default LoginFormModal;
