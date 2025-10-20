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
    form: initialForm,
    uuid: '',
}

const ModalActionEditState = createSlice({
    name: "ModalActionEditState",
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
        },
        setUuid: (state, action) => {
          const { value } = action.payload
          state.uuid = value
        }
    }
})

export const formSelector = (state) => {
  return state.ui.modals.actionEdit.form
}

export const openedSelector = (state)  => {
  return state.ui.modals.actionEdit.opened
}

export const uuidSelector = (state) => {
  return state.ui.modals.actionEdit.uuid
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
    setUuid,
} = ModalActionEditState.actions;

export default ModalActionEditState.reducer;