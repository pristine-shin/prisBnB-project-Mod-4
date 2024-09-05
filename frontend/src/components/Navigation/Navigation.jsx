import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { SiAirbnb } from "react-icons/si";
import './Navigation.css'

const Navigation = ({ isLoaded }) => {

    const currUser = useSelector((state) => state.session.user);

    const sessionLinks = currUser ? (
        <>
          <li>
            <ProfileButton user={currUser} />
          </li>
        </>
      ) : (
        <>
          <li>
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li>
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </li>
        </>
      );

      return (
        <ul className='navbar'>
          <li className='home-container'>
            <SiAirbnb id='logo'/>
            <NavLink to="/" id='home-button'>prisbnb</NavLink>
          </li>
          {isLoaded && sessionLinks}
        </ul>
      );
    }

export default Navigation
