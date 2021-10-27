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
    todos: [],
    errors: null,
    loadingCreate: false,
    loadingUpdate: false,
    todoCreate: {
        error: null,
        loading: false,
        status: null,
    },
    todoUpdate: {
        error: null,
        loading: false,
        status: null,
    },
    todoDelete: {
        error: null,
        loading: false,
        status: null,
    },
};

export const TodosReducer = (state = initReducer, {type, payload}) => {
    switch (type) {
        case genericType(CREATE_TODO, ENUM_STATUS.RESET):
            return {
                ...state,
                currentType: type,
                todoCreate: {
                    ...state.todoCreate,
                    loading: false,
                    status: null,
                    error: null,
                },
            };
        case genericType(CREATE_TODO, ENUM_STATUS.FETCHING):
            return {
                ...state,
                currentType: type,
                todoCreate: {
                    ...state.todoCreate,
                    loading: true,
                    status: null,
                },
            };
        case genericType(CREATE_TODO, ENUM_STATUS.FAILURE):
            return {
                ...state,
                currentType: type,
                todoCreate: {
                    ...state.todoCreate,
                    loading: false,
                    error: payload,
                    status: "failure",
                },
            };
        case genericType(CREATE_TODO, ENUM_STATUS.SUCCESS):
            return {
                ...state,
                currentType: type,
                todoCreate: {
                    ...state.todoCreate,
                    loading: false,
                    status: "success",
                },
            };

        case genericType(UPDATE_TODO, ENUM_STATUS.RESET):
            return {
                ...state,
                currentType: type,
                todoUpdate: {
                    ...state.todoUpdate,
                    loading: false,
                    status: null,
                    error: null,
                },
            };
        case genericType(UPDATE_TODO, ENUM_STATUS.FETCHING):
            return {
                ...state,
                currentType: type,
                todoUpdate: {
                    ...state.todoUpdate,
                    loading: true,
                    status: null,
                },
            };
        case genericType(UPDATE_TODO, ENUM_STATUS.FAILURE):
            return {
                ...state,
                currentType: type,
                todoUpdate: {
                    ...state.todoUpdate,
                    loading: false,
                    error: payload,
                    status: "failure",
                },
            };
        case genericType(UPDATE_TODO, ENUM_STATUS.SUCCESS):
            return {
                ...state,
                currentType: type,
                todoUpdate: {
                    ...state.todoUpdate,
                    loading: false,
                    status: "success",
                },
            };

        case genericType(DELETE_TODO, ENUM_STATUS.RESET):
            return {
                ...state,
                currentType: type,
                todoDelete: {
                    ...state.todoDelete,
                    loading: false,
                    status: null,
                    error: null,
                },
            };
        case genericType(DELETE_TODO, ENUM_STATUS.FETCHING):
            return {
                ...state,
                currentType: type,
                todoDelete: {
                    ...state.todoDelete,
                    loading: true,
                    status: null,
                },
            };
        case genericType(DELETE_TODO, ENUM_STATUS.FAILURE):
            return {
                ...state,
                currentType: type,
                todoDelete: {
                    ...state.todoDelete,
                    loading: false,
                    error: payload,
                    status: "failure",
                },
            };
        case genericType(DELETE_TODO, ENUM_STATUS.SUCCESS):
            return {
                ...state,
                currentType: type,
                todoDelete: {
                    ...state.todoDelete,
                    loading: false,
                    status: "success",
                },
            };

        case genericType(GET_ALL_TODO, ENUM_STATUS.RESET):
            return {
                ...state,
                currentType: type,
                loading: false,
                status: ""
            };
        case genericType(GET_ALL_TODO, ENUM_STATUS.FETCHING):
            return {
                ...state,
                currentType: type,
                loading: true,
                status: payload
            };
        case genericType(GET_ALL_TODO, ENUM_STATUS.FAILURE):
            return {
                ...state,
                currentType: type,
                loading: false,
                loadingCreate: false,
                errors: payload,
            };
        case genericType(GET_ALL_TODO, ENUM_STATUS.SUCCESS):
            return {
                ...state,
                currentType: type,
                loading: false,
                todos: payload.todos,
            };
        default:
            return Object.assign({}, state);
    }
};
