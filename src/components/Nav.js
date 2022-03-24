import React from "react";
import {
  FaHome,
  FaFile,
  FaEye,
  FaPen,
  FaBookOpen,
  FaTrophy,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const NavLink = ({ to, title, children }) => {
  return (
    <Link
      to={to}
      className="w-full text-white focus:text-main-green hover:text-main-green justify-center inline-block text-center pt-2 pb-1"
    >
      {children}
      <span className="tab tab-kategori block text-xs">{title}</span>
    </Link>
  );
};
export default function Nav() {
  return (
    <div className=" from-dark-blue bg-gradient-to-b to-stone-900">
      {/* <section id="bottom-navigation" class="md:hidden block fixed inset-x-0 bottom-0 z-10 bg-white shadow"> // if shown only tablet/mobile--> */}
      <section
        id="bottom-navigation"
        className="block fixed w-screen inset-x-0 bottom-0 z-10 from-dark-blue bg-gradient-to-b to-stone-900 shadow"
      >
        <div id="tabs" className="flex justify-between">
          <NavLink to="/" title="Home">
            <FaHome className="inline-block mb-1" />
          </NavLink>
          <NavLink to="/lesson" title="Lesson">
            <FaFile className="inline-block mb-1" />
          </NavLink>
          <NavLink to="/write" title="Write">
            <FaPen className="inline-block mb-1" />
          </NavLink>
          <NavLink to="/cards" title="Cards">
            <FaEye className="inline-block mb-1" />
          </NavLink>
          <NavLink to="/test" title="Test">
            <FaBookOpen className="inline-block mb-1" />
          </NavLink>
          <NavLink to="/quiz" title="Quiz">
            <FaTrophy className="inline-block mb-1" />
          </NavLink>
        </div>
      </section>
    </div>
  );
}
