import {
  CREATE_TODO,
  ENUM_STATUS,
  genericType,
  GET_ALL_TODO,
  INIT_TODO,
  REMOVE_TODO,
  UPDATE_TODO,
} from "../actions";

const initReducer = {
  loading: false,
  currentType: "",
  todos: [],
  errors: null,
  count: 0,
  page: 0,
  loadingCreate: false,
  loadingUpdate: false,
};

export const TodosReducer = (state = initReducer, { type, payload }) => {
  switch (type) {
    case genericType(REMOVE_TODO, ENUM_STATUS.FETCHING):
    case genericType(GET_ALL_TODO, ENUM_STATUS.FETCHING):
      return {
        ...state,
        currentType: type,
        loading: true,
      };

    case genericType(CREATE_TODO, ENUM_STATUS.FETCHING):
      return {
        ...state,
        currentType: type,
        loadingCreate: true,
      };

    case genericType(UPDATE_TODO, ENUM_STATUS.FETCHING):
      return {
        ...state,
        currentType: type,
        loadingUpdate: true,
      };
    case genericType(CREATE_TODO, ENUM_STATUS.FAILURE):
    case genericType(UPDATE_TODO, ENUM_STATUS.FAILURE):
    case genericType(REMOVE_TODO, ENUM_STATUS.FAILURE):
    case genericType(GET_ALL_TODO, ENUM_STATUS.FAILURE):
      return {
        ...state,
        currentType: type,
        loading: false,
        loadingCreate: false,
        errors: payload,
      };

    // case genericType(INIT_TODO, ENUM_STATUS.SUCCESS):
    case genericType(CREATE_TODO, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        currentType: type,
        // todos: [...state.todos, payload],
        loadingCreate: false,
      };

    case genericType(UPDATE_TODO, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        currentType: type,
        todos: [...state.todos, payload],
        loading: false,
      };
    case genericType(REMOVE_TODO, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        currentType: type,
        // todos: [...state.todos, payload],
        loading: false,
      };
    case genericType(GET_ALL_TODO, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        currentType: type,
        loading: false,
        todos: payload.todos,
        count: payload.count,
        page: payload.page,
      };
    default:
      return Object.assign({}, state);
  }
};
