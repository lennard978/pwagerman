import React from "react";
import {
  FaHome,
  FaFile,
  FaEye,
  FaPen,
  FaBookOpen,
  FaTrophy,
} from "react-icons/fa";
export default function Nav() {
  return (
    <div className="w-full h-screen from-dark-blue bg-gradient-to-b to-stone-900">
      {/* <section id="bottom-navigation" class="md:hidden block fixed inset-x-0 bottom-0 z-10 bg-white shadow"> // if shown only tablet/mobile--> */}
      <section
        id="bottom-navigation"
        className="block fixed inset-x-0 bottom-0 z-10 from-dark-blue bg-gradient-to-b to-stone-900 shadow"
      >
        <div id="tabs" className="flex justify-between">
          <a
            href="#"
            className="w-full text-white focus:text-main-green hover:text-main-green justify-center inline-block text-center pt-2 pb-1"
          >
            <FaHome className="inline-block mb-1" />
            <span className="tab tab-kategori block text-xs">Home</span>
          </a>
          <a
            href="#"
            className="w-full text-white focus:text-main-green hover:text-main-green justify-center inline-block text-center pt-2 pb-1"
          >
            <FaFile className="inline-block mb-1" />
            <span className="tab tab-kategori block text-xs">Learn</span>
          </a>
          <a
            href="#"
            className="w-full text-white focus:text-main-green hover:text-main-green justify-center inline-block text-center pt-2 pb-1"
          >
            <FaPen className="inline-block mb-1" />
            <span className="tab tab-kategori block text-xs">Write</span>
          </a>
          <a
            href="#"
            className="w-full text-white focus:text-main-green hover:text-main-green justify-center inline-block text-center pt-2 pb-1"
          >
            <FaEye className="inline-block mb-1" />
            <span className="tab tab-kategori block text-xs">Cards</span>
          </a>
          <a
            href="#"
            className="w-full text-white focus:text-main-green hover:text-main-green justify-center inline-block text-center pt-2 pb-1"
          >
            <FaBookOpen className="inline-block mb-1" />
            <span className="tab tab-kategori block text-xs">Test</span>
          </a>
          <a
            href="#"
            className="w-full text-white focus:text-main-green hover:text-main-green justify-center inline-block text-center pt-2 pb-1"
          >
            <FaTrophy className="inline-block mb-1 " />
            <span className="tab tab-kategori block text-xs">Quiz</span>
          </a>
        </div>
      </section>
    </div>
  );
}
