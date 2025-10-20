import { createSlice } from "@reduxjs/toolkit";

const initialForm = {
  name: '',
  description: '',
}

const initialState = {
    opened: false,
    form: initialForm
}

const ModalDatastreamAddState = createSlice({
    name: "ModalDatastreamAddState",
    initialState: initialState,
    reducers: {
        clearForm: (state, action) => {
          state.form = initialForm
        },
        openModal: (state, action) => {
          state.opened = true
        },
        closeModal: (state, action) => {
          state.opened = false
        },

        setTitle: (state, action) => {
            const { value } = action.payload;
            state.form.title = value;
        },
        setDescription: (state, action) => {
            const { value } = action.payload;
            state.form.description = value;
        },
    }
})

export const formSelector = (state) => {
  return state.ui.modals.datastreamAdd.form
}

export const openedSelector = (state)  => {
  return state.ui.modals.datastreamAdd.opened
}

export const {
    clearForm,
    openModal,
    closeModal,
    setTitle,
    setDescription,
} = ModalDatastreamAddState.actions;

export default ModalDatastreamAddState.reducer;