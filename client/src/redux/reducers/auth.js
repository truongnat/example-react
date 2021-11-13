import {ENUM_STATUS, genericType, LOGIN} from "../actions";

const initReducer = {
  user: null,
  loading: false,
  currentType: "",
  errors: null,
};

export const AuthReducer = (state = initReducer, {type, payload}) => {
  switch (type) {
    case genericType(LOGIN, ENUM_STATUS.FETCHING):
      return {
        ...state,
        loading: true,
        currentType: type,
        errors: null,
      };
    case genericType(LOGIN, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        loading: false,
        user: payload,
        currentType: type,
        errors: null,
      };
    case genericType(LOGIN, ENUM_STATUS.FAILURE):
      return {
        ...state,
        loading: false,
        errors: payload,
        user: null,
        currentType: type,
      };
    case genericType(LOGIN, ENUM_STATUS.RESET):
      return {
        ...state,
        ...initReducer
      }
    default:
      return Object.assign({}, state);
  }
};
