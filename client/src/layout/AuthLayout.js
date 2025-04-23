"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLayout = AuthLayout;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const logo_mern_png_1 = __importDefault(require("../assets/images/logo-mern.png"));
function AuthLayout({ title, children, footer }) {
    return (<react_2.Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <react_2.Flex p={8} flex={1} align={"center"} justify={"center"}>
        <react_2.Stack spacing={4} w={"full"} maxW={"md"}>
          <react_2.Image w={300} h={200} mx={"auto"} src={logo_mern_png_1.default} alt="logo-application"/>
          <react_2.Heading textAlign={"center"} pb={50} fontSize={"2xl"}>
            {title}
          </react_2.Heading>
          {children}
          {footer}
        </react_2.Stack>
      </react_2.Flex>
    </react_2.Stack>);
}
