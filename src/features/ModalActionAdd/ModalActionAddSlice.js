import { createSlice } from "@reduxjs/toolkit";

const initialForm = {
  parentId: '',
  title: '',
  description: '',
  tags: [],
  state: 'paused',
}

const initialState = {
    opened: false,
    form: initialForm
}

const ModalActionAddState = createSlice({
    name: "ModalActionAddState",
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
        setParentId: (state, action) => {
            const { value } = action.payload;
            state.form.parentId = value;
        },
        setTitle: (state, action) => {
            const { value } = action.payload;
            state.form.title = value;
        },
        setDescription: (state, action) => {
            const { value } = action.payload;
            state.form.description = value;
        },
        setTags: (state, action) => {
            const { list } = action.payload;
            state.form.tags = list;
        },
        setActionState: (state, action) => {
            const { value } = action.payload;
            state.form.state = value;
        }
    }
})

export const formSelector = (state) => {
  return state.ui.modals.actionAdd.form
}

export const openedSelector = (state)  => {
  return state.ui.modals.actionAdd.opened
}

export const {
    clearForm,
    openModal,
    closeModal,
    setParentId,
    setTitle,
    setDescription,
    setTags,
    setActionState,
} = ModalActionAddState.actions;

export default ModalActionAddState.reducer;