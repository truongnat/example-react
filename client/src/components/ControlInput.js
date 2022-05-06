import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useColorMode,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { Controller } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export function ControlInputComp({
  name,
  control,
  rules,
  errorMessage = "",
  label,
  placeholder = name,
  type,
  isPassword,
  component: Component = Input,
  children,
  ...rest
}) {
  const [show, setShow] = React.useState(false);
  const handleShowInput = () => setShow(!show);
  const { colorMode } = useColorMode();

  function checkTypeInput() {
    return isPassword && !show ? "password" : type || "text";
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormControl isInvalid={errorMessage}>
          <FormLabel>{label}</FormLabel>
          <InputGroup>
            <Component
              {...field}
              {...rest}
              type={checkTypeInput()}
              color={colorMode === "light" ? "black" : "white"}
              placeholder={placeholder}
            >
              {children}
            </Component>
            {isPassword && (
              <InputRightElement>
                <IconButton
                  onClick={handleShowInput}
                  icon={show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                />
              </InputRightElement>
            )}
          </InputGroup>
          {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
        </FormControl>
      )}
    />
  );
}

export default memo(ControlInputComp);
