import { ENUM_STATUS, genericType, LOGIN } from "./actions";

const initReducer = {
  user: null,
  loading: false,
  posts: [],
  currentType: "",
  errors: null,
};

export const RootReducer = (state = initReducer, { type, payload }) => {
  switch (type) {
    case genericType(LOGIN, ENUM_STATUS.FETCHING):
      return {
        ...state,
        loading: true,
        currentType: type,
      };
    case genericType(LOGIN, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        loading: false,
        user: payload,
        currentType: type,
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
      break;
  }
};
