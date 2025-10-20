
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import DatastreamSlice from "../features/Datastream/DatastreamSlice";
import ModalActionAddSlice from "../features/ModalActionAdd/ModalActionAddSlice"
import ModalActionEditSlice from '../features/ModalActionEdit/ModalActionEditSlice'
import ModalLoginCautionSlice from "../features/ModalLoginCaution/ModalLoginCautionSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import DatashedSlice from "../features/Datashed/DatashedSlice";
import SessionManagerSlice from "./SessionManager/SessionManagerSlice";
import ModalDatastreamAddSlice from "../features/ModalDatastreamAdd/ModalDatastreamAddSlice";

// const persistConfig = {
//   key: "datastream-store",
//   storage
// }

const baseReducer = combineReducers({
  sessionManager: SessionManagerSlice,
  datastream: DatastreamSlice,
  datashed: DatashedSlice,
  ui: combineReducers({
    modals: combineReducers({
      actionAdd: ModalActionAddSlice,
      actionEdit: ModalActionEditSlice,
      loginCaution: ModalLoginCautionSlice,
      datastreamAdd: ModalDatastreamAddSlice
    })
  })
})

// const persistedReducer = persistReducer(persistConfig, baseReducer)

const store = configureStore({
  // reducer: persistedReducer
  reducer: baseReducer
})

// const persistor = persistStore(store)

export default store;
// export { persistor }