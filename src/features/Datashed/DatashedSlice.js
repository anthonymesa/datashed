import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import { getUser } from "../../app/SessionManager/SessionManagerSlice";

const defaultDatastream = {
    uuid: '',
    name: '',
    userId: '',
    description: '',
    actions: [],
}

const initialState = {
    datastreams: [
        // {
        //     uuid: 'datastream1',
        //     userid: '',
        //     name: 'Datastream 1',
        //     description: 'A first test',
        //     actions: ['action1'],
        // },
        // {
        //     uuid: 'datastream2',
        //     userid: '',
        //     name: 'Datastream 2',
        //     description: 'A second test',
        //     actions: ['action2'],
        // },
        // {
        //     uuid: 'datastream3',
        //     userid: '',
        //     name: 'Datastream 3',
        //     description: 'A third test',
        //     actions: ['action3'],
        // }
    ],
    currentFocus: '' // the datastream currently being looked at.
}

const Datashed = createSlice({
    name: 'Datashed',
    initialState: initialState,
    reducers: {
        setDatastreams: (state, action) => {
            const { datastreams } = action.payload
            state.datastreams = datastreams
        },
        addDatastream: (state, action) => {
            const { name, description } = action.payload
            const uuid = uuidv4();
            const userId = getUser()
            state.datastreams.push({
                ...defaultDatastream,
                uuid,
                userId,
                name,
                description
            })
        },
        deleteDatastream: (state, action) => {
            const { uuid } = action.payload
            state.datastreams = state.datastreams.filter(each => each.uuid != uuid);
        },
        updateDatastream: (state, action) => {
            const { uuid, name, description } = action.payload

            state.datastreams = getUpdatedDatastreams(state, {uuid, update: {name, description}})
        },
        addActionToDatastream: (state, action) => {
            const { datastreamUuid, actionUuid } = action.payload
            const actions = state.datastreams.find(each => each.uuid == datastreamUuid).actions
            actions.push(actionUuid)
            state.datastreams = getUpdatedDatastreams(state, {uuid: datastreamUuid, update: {actions}})
        },
        deleteActionFromDatastream: (state, action) => {
            const { datastreamUuid, actionUuid } = action.payload
            const actions = state.datastreams.find(each => each.uuid == datastreamUuid).actions
            if(actions.find(each => each.uuid == actionUuid).length > 0) return
            state.datastreams = getUpdatedDatastreams(state, {uuid: datastreamUuid, update: {actions: actions.filter(each => each.uuid != actionUuid)}})
        },
        setCurrent: (state, action) => {
            const { index } = action.payload
            state.currentFocus = state.datastreams[index].uuid
        }
    }
})

export const allDatastreamsSelector = (state) => {
    return state.datashed.datastreams
}

export const DatashedEmpty = (state) => {
    return state.datashed.datastreams.length == 0
}

export const actionNamesSelector = (state, uuid) => {
    const stream = state.datashed.datastreams.find(each => each.uuid == uuid)
    return stream ? stream.actions : []
}

export const currentFocusSelector = (state) => {
    return state.datashed.currentFocus
}

function getUpdatedDatastreams(state, {uuid, update}) {
    const { name, description, actions } = update
    return state.datastreams.map(each => each.uuid == uuid ? 
        {
            ...each,
            name: name ? name : each.name,
            description: description ? description : each.description,
            actions: actions ? actions : each.actions
        }
        : each)
}

export const {
    addDatastream,
    deleteDatastream,
    updateDatastream,
    setDatastreams,
    setCurrent,
    addActionToDatastream,
    deleteActionFromDatastream
} = Datashed.actions



export default Datashed.reducer