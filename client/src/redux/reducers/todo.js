import {
  CREATE_TODO,
  ENUM_STATUS,
  genericType,
  GET_ALL_TODO,
  DELETE_TODO,
  UPDATE_TODO,
} from "../actions";

const initReducer = {
  loading: false,
  currentType: "",
  status: "",
  todoList: [],
  errorMessage: "",
};

export const TodoReducer = (state = initReducer, { type, payload }) => {
  switch (type) {
    case genericType(CREATE_TODO, ENUM_STATUS.FETCHING):
    case genericType(UPDATE_TODO, ENUM_STATUS.FETCHING):
    case genericType(DELETE_TODO, ENUM_STATUS.FETCHING):
      return {
        ...state,
        currentType: type,
        loading: true,
      };

    case genericType(CREATE_TODO, ENUM_STATUS.FAILURE):
    case genericType(UPDATE_TODO, ENUM_STATUS.FAILURE):
    case genericType(DELETE_TODO, ENUM_STATUS.FAILURE):
    case genericType(GET_ALL_TODO, ENUM_STATUS.FAILURE):
      return {
        ...state,
        currentType: type,
        errorMessage: payload,
        loading: false,
      };

    case genericType(GET_ALL_TODO, ENUM_STATUS.FETCHING):
      return {
        ...state,
        currentType: type,
        loading: true,
        status: payload.status,
      };

    case genericType(GET_ALL_TODO, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        currentType: type,
        loading: false,
        todoList: payload,
      };
    default:
      return Object.assign({}, state);
  }
};
