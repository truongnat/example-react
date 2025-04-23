"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainLayout = MainLayout;
const react_1 = require("@chakra-ui/react");
const react_2 = __importDefault(require("react"));
const components_1 = require("../components");
function MainLayout({ title, children }) {
    return (<react_1.Stack minH={"100vh"} alignItems="center" justifyContent="space-between">
			<components_1.Header />
			<react_1.Box mt={30} w={'100%'}>
				<react_1.Text as={"h2"} fontSize="4xl" bgClip="text" bgGradient="linear(to-r, teal.500, green.500)" fontWeight="bold" textAlign="center" className="my-5">
					{title}
				</react_1.Text>
				{children}
			</react_1.Box>
			<react_1.Box className="w-full">
				<components_1.Footer />
			</react_1.Box>
		</react_1.Stack>);
}
