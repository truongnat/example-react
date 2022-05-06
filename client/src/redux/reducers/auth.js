import {
  CHECKING_AUTH,
  ENUM_STATUS,
  genericType,
  LOGIN,
  REGISTER,
} from "../actions";

const initReducer = {
  loading: false,
  currentType: "",
  messageError: "",
};

export const AuthReducer = (state = initReducer, { type, payload }) => {
  switch (type) {
    case genericType(LOGIN, ENUM_STATUS.FETCHING):
    case genericType(REGISTER, ENUM_STATUS.FETCHING):
      return {
        ...state,
        loading: true,
        currentType: type,
        messageError: "",
      };
    case genericType(LOGIN, ENUM_STATUS.SUCCESS):
    case genericType(CHECKING_AUTH, ENUM_STATUS.SUCCESS):
    case genericType(REGISTER, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        loading: false,
        currentType: type,
        messageError: "",
      };
    case genericType(LOGIN, ENUM_STATUS.FAILURE):
    case genericType(REGISTER, ENUM_STATUS.FAILURE):
      return {
        ...state,
        loading: false,
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
