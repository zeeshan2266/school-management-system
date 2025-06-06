import {api} from "../../../../../common";


export const FETCH_CLASSES_REQUEST = 'FETCH_CLASSES_REQUEST';
export const FETCH_CLASSES_SUCCESS = 'FETCH_CLASSES_SUCCESS';
export const FETCH_CLASSES_FAILURE = 'FETCH_CLASSES_FAILURE';
export const ADD_CLASS = 'ADD_CLASS';
export const UPDATE_CLASS = 'UPDATE_CLASS';
export const DELETE_CLASS = 'DELETE_CLASS';
export const ADD_SECTION = 'ADD_SECTION';
export const DELETE_SECTION = 'DELETE_SECTION';

// Action creators
export const fetchClassesRequest = () => ({type: FETCH_CLASSES_REQUEST});
export const fetchClassesSuccess = (classes) => ({type: FETCH_CLASSES_SUCCESS, payload: classes});
export const fetchClassesFailure = (error) => ({type: FETCH_CLASSES_FAILURE, payload: error});

export const addClass = (newClass) => ({type: ADD_CLASS, payload: newClass});
export const updateClass = (updatedClass) => ({type: UPDATE_CLASS, payload: updatedClass});
export const deleteClass = (classId) => ({type: DELETE_CLASS, payload: classId});

export const addSection = (classIndex) => ({type: ADD_SECTION, payload: classIndex});

export const deleteSection = (classIndex, sectionIndex) => ({
    type: DELETE_SECTION,
    payload: {classIndex, sectionIndex}
});

export const fetchClasses = (schoolId, session) => async (dispatch) => {
    dispatch(fetchClassesRequest());
    try {
        const response = await api.get('/api/master/class', {
            params: {schoolId, session}
        });
        dispatch(fetchClassesSuccess(response.data));
    } catch (error) {
        dispatch(fetchClassesFailure(error.message));
    }
};

export const submitClasses = (classes, schoolId, session) => async (dispatch) => {
    try {
        await api.post('/api/master/class', classes);
        alert('Classes and sections created/updated successfully!');


        dispatch(fetchClasses(schoolId, session)); // Refetch classes after submitting
    } catch (error) {
        console.error('Error creating/updating classes and sections:', error);
        alert('Error creating/updating classes and sections.');
    }
};

export const removeClass = (classId) => async (dispatch) => {
    try {
        await api.delete(`/api/master/class/${classId}`);
        dispatch(deleteClass(classId));
    } catch (error) {
        console.error('Error deleting class:', error);
    }
};

export const removeSection = (classIndex, sectionIndex, sectionId) => async (dispatch) => {
    try {
        console.log("Deleting section with id:", sectionId);
        await api.delete(`/api/master/section/${sectionId}`);
        console.log("Section deleted successfully");

        dispatch(deleteSection(classIndex, sectionIndex));
    } catch (error) {
        console.error('Error deleting section:', error);
    }
};
