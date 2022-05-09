import {
  FORGOT_PASSWORD,
  CHECKING_AUTH,
  ENUM_STATUS,
  genericType,
  REGISTER,
  LOGIN,
  VERITY_OTP,
} from "../actions";

const initReducer = {
  loading: false, // property loading internal
  currentType: "",
  messageError: "",
};

export const AuthReducer = (state = initReducer, { type, payload }) => {
  switch (type) {
    case genericType(LOGIN, ENUM_STATUS.FETCHING):
    case genericType(REGISTER, ENUM_STATUS.FETCHING):
    case genericType(FORGOT_PASSWORD, ENUM_STATUS.FETCHING):
    case genericType(VERITY_OTP, ENUM_STATUS.FETCHING):
      return {
        ...state,
        currentType: type,
        messageError: "",
      };
    case genericType(LOGIN, ENUM_STATUS.SUCCESS):
    case genericType(CHECKING_AUTH, ENUM_STATUS.SUCCESS):
    case genericType(REGISTER, ENUM_STATUS.SUCCESS):
    case genericType(FORGOT_PASSWORD, ENUM_STATUS.SUCCESS):
    case genericType(VERITY_OTP, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        currentType: type,
        messageError: "",
      };
    case genericType(LOGIN, ENUM_STATUS.FAILURE):
    case genericType(REGISTER, ENUM_STATUS.FAILURE):
    case genericType(FORGOT_PASSWORD, ENUM_STATUS.FAILURE):
    case genericType(VERITY_OTP, ENUM_STATUS.FAILURE):
      return {
        ...state,
        messageError: payload,
        currentType: type,
      };
    case genericType(LOGIN, ENUM_STATUS.RESET):
      return {
        ...state,
        ...initReducer,
        currentType: type,
      };
    default:
      return Object.assign({}, state);
  }
};
