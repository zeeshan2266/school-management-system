import {
    ADD_CLASS,
    ADD_SECTION,
    DELETE_CLASS,
    DELETE_SECTION,
    FETCH_CLASSES_FAILURE,
    FETCH_CLASSES_REQUEST,
    FETCH_CLASSES_SUCCESS,
    UPDATE_CLASS
} from "./Action";


const initialState = {
    loading: false,
    classes: [],
    error: null,
};

export const classesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CLASSES_REQUEST:
            return {...state, loading: true};
        case FETCH_CLASSES_SUCCESS:
            return {...state, loading: false, classes: action.payload};
        case FETCH_CLASSES_FAILURE:
            return {...state, loading: false, error: action.payload};
        case ADD_CLASS:
            return {...state, classes: [...state.classes, action.payload]};
        case UPDATE_CLASS:
            return {
                ...state,
                classes: state.classes.map((c, index) =>
                    index === action.payload.index ? action.payload.updatedClass : c
                ),
            };
        case DELETE_CLASS:
            return {...state, classes: state.classes.filter((c) => c.id !== action.payload)};
        case ADD_SECTION:
            return {
                ...state,
                classes: state.classes.map((c, index) =>
                    index === action.payload ? {...c, sections: [...c.sections, {name: ''}]} : c
                ),
            };
        case DELETE_SECTION:
            return {
                ...state,
                classes: state.classes.map((c, index) =>
                    index === action.payload.classIndex
                        ? {
                            ...c,
                            sections: c.sections.filter((_, sIndex) => sIndex !== action.payload.sectionIndex),
                        }
                        : c
                ),
            };
        default:
            return state;
    }
};
