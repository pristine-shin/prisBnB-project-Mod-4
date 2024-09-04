import { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal';
// import { Navigate } from "react-router-dom";
import './LoginForm.css'

const LoginFormModal = () => {
  const dispatch = useDispatch();
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

export default LoginFormModal;
