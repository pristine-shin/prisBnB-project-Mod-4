import { useEffect, useState, useRef } from 'react';
import { NavLink } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosMenu } from "react-icons/io";
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();// Keep click from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  }

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
        if (ulRef.current && !ulRef.current.contains(e.target)) {
            setShowMenu(false);
        }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu])

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} id='menu-button'>
        <IoIosMenu />
        <FaUserCircle id='profile-logo'/>
      </button>
      <div className={ulClassName} ref={ulRef}>
        <li className='profile-menu-item'>Hello, {user.username}</li>
        <li className='profile-menu-item' id='user-email'>{user.email}</li>
        <NavLink to={`/spots/current`} className='profile-menu-item' id='manage-spots-container'>Manage Spots</NavLink>
        <li className='profile-menu-item' id='log-out-container'>
          <button onClick={logout} id='log-out-button'>Log Out</button>
        </li>
      </div>
    </>
  );
}

export default ProfileButton;
