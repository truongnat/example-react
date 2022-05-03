import { ENUM_STATUS, genericType, SET_USER, UPDATE_USER } from "../actions";

const initReducer = {
  user: null,
  loading: false,
  currentType: "",
  messageError: "",
};

export const UserReducer = (state = initReducer, { type, payload }) => {
  switch (type) {
    case genericType(SET_USER, ENUM_STATUS.PUSH_NORMAL):
    case genericType(UPDATE_USER, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        loading: false,
        currentType: type,
        messageError: "",
        user: payload,
      };
    case genericType(UPDATE_USER, ENUM_STATUS.FETCHING):
      return {
        ...state,
        loading: true,
        currentType: type,
        messageError: "",
      };

    case genericType(UPDATE_USER, ENUM_STATUS.FAILURE):
      return {
        ...state,
        loading: false,
        currentType: type,
        messageError: payload,
      };

    default:
      return Object.assign({}, state);
  }
};
