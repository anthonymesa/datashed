import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    opened: false,
}

const ModalLoginCaution = createSlice({
    name: "ModalLoginCaution",
    initialState: initialState,
    reducers: {
        openModalLoginCaution: (state, action) => {
          state.opened = true
        },
        closeModalLoginCaution: (state, action) => {
          state.opened = false
        },
    }
})

export const openedSelector = (state)  => {
  return state.ui.modals.loginCaution.opened
}

export const {
    openModalLoginCaution,
    closeModalLoginCaution,
} = ModalLoginCaution.actions;

export default ModalLoginCaution.reducer;