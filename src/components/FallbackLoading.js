import React from "react";
import Logo from "../assets/icons/logo.svg";
import { Image } from "@chakra-ui/react";

export function FallbackLoading() {
  return (
    <div className="container">
      <Image w={350} h={350} src={Logo} alt="logo" />
    </div>
  );
}
