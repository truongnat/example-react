import {
  CHECKING_AUTH,
  ENUM_STATUS,
  genericType,
  LOADING_APP,
} from "../actions";

const initReducer = {
  isAuthenticated: false,
  loading: true,
  currentType: "",
};

export const AppReducer = (state = initReducer, { type, payload }) => {
  switch (type) {
    case genericType(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL):
      return {
        ...state,
        currentType: type,
        isAuthenticated: payload,
      };
    case genericType(LOADING_APP, ENUM_STATUS.PUSH_NORMAL):
      return {
        ...state,
        currentType: type,
        loading: payload,
      };
    default:
      return Object.assign({}, state);
  }
};
