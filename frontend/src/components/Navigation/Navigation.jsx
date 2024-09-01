import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';

const Navigation = ({ isLoaded }) => {

    const currUser = useSelector((state) => state.session.user);
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    const sessionLinks = currUser ? (
        <>
          <li>
            <ProfileButton user={currUser} />
          </li>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/login">Log In</NavLink>
          </li>
          <li>
            <NavLink to="/signup">Sign Up</NavLink>
          </li>
        </>
      );

      return (
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {isLoaded && sessionLinks}
        </ul>
      );
    }

export default Navigation
