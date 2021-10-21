import { CHECKING_AUTH, ENUM_STATUS, genericType, LOGIN } from "./actions";

const initReducer = {
  isAuthenticated: false,
  user: null,
  loading: false,
  posts: [],
  currentType: "",
  errors: null,
};

export const RootReducer = (state = initReducer, { type, payload }) => {
  switch (type) {
    case genericType(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL):
      return {
        ...state,
        currentType: type,
        isAuthenticated: payload,
      };
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
        error: payload,
        user: null,
        currentType: type,
      };
    default:
      return Object.assign({}, state);
  }
};
