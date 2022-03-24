import React from "react";

export default function Title({ title }) {
  return (
    <h1 className="text-2xl text-main-green uppercase h-12 fixed w-screen text-center pt-2 from-dark-blue bg-gradient-to-b to-stone-900">
      {title}
    </h1>
  );
}
