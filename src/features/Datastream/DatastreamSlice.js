import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import localStorage from "../../app/localStorage";
import { getUser } from "../../app/SessionManager/SessionManagerSlice";
import { addActionToDatastream, currentFocusSelector } from "../Datashed/DatashedSlice";

export const ACTION_STATE = {
    PAUSED: 'paused',
    INCOMPLETE: 'incomplete',
    COMPLETE: 'complete',
}


const msg1 =
    `A description can be used to give more details about an action. Currently the descriptions are just text with formatting, but in a future release they will be markdown, so that styling and formatting looks that much better!

The buttons below allow you to add, edit or delete a datum (only action data is supported currently).`


const msg2 =
    `The completed state of a sub action affects the completed state of the parent action. The three action states are:

- Paused
- Incomplete
- Complete

Select the gizmo on this task to cycle through the states.`

const msg3 =
    `All incomplete sub actions must be completed for a parent action to be complete. 
    
Setting an action to a 'paused' state is helpful if an action is still relevant to its parent, but isn't required for the parent to be completed.
`

const msg4 =
    `Currently in v1.0, the only data you can create for a datastream is an Action, but later versions will include the ability to manage memos, files, and bookmark links in your datastream as well!`

function getDefaultActions() {
    return [
        // {
        //     uuid: 'action1',
        //     parentUuid: '',
        //     userId: '',
        //     tags: [],
        //     title: 'This is an action. Click to see more!',
        //     description: msg1,
        //     state: 'paused'
        // },
        // {
        //     uuid: 'action2',
        //     parentUuid: 'action1',
        //     userId: '',
        //     tags: [],
        //     title: 'This is a sub action.',
        //     description: msg2,
        //     state: 'paused'
        // },
        // {
        //     parentUuid: 'action1',
        //     uuid: 'action3',
        //     userId: '',
        //     tags: [],
        //     title: 'This is another sub action!',
        //     description: msg3,
        //     state: 'paused'
        // },
        // {
        //     parentUuid: 'action3',
        //     uuid: 'action4',
        //     userId: '',
        //     tags: [],
        //     title: 'Nest your data as deep as you want!',
        //     description: msg4,
        //     state: 'paused'
        // },
    ];
}

const initialState = {
    actions: getDefaultActions(),
    activeAction: '',
}

// Helper function to get all descendants of a given UUID
const getAllDescendants = (actions, uuid) => {
    let descendants = [];
    const children = actions.filter(action => action.parentUuid === uuid);
    descendants = descendants.concat(children);
    children.forEach(child => {
        descendants = descendants.concat(getAllDescendants(actions, child.uuid));
    });
    return descendants;
}

const DatastreamState = createSlice({
    name: "DatastreamState",
    initialState: initialState,
    reducers: {
        setActions: (state, action) => {
            const { actions } = action.payload
            state.actions = actions
        },
        addAction: (state, action) => {
            const { newAction } = action.payload
            newAction["userId"] = getUser()
            state.actions.push(newAction)
        },
        updateAction: (state, action) => {
            const { uuid, data } = action.payload;

            const actionIndex = state.actions.findIndex((e) => e.uuid == uuid);

            if (actionIndex != -1) {
                state.actions[actionIndex] = data;
            }

            state.actions[actionIndex]["uuid"] = uuid
        },
        // Modified deleteAction reducer
        deleteAction: (state, action) => {
            const { uuid } = action.payload;
            const descendants = getAllDescendants(state.actions, uuid);
            const allUuidsToDelete = [uuid, ...descendants.map(descendant => descendant.uuid)];
            state.actions = state.actions.filter(action => !allUuidsToDelete.includes(action.uuid));
        },
        cycleState: (state, action) => {
            const { uuid } = action.payload;
            const currentAction = state.actions.find((e) => e.uuid == uuid);

            const setNextState = (state, progress) => {
                switch (state) {
                    case ACTION_STATE.PAUSED:
                        return progress == 100 ? ACTION_STATE.COMPLETE : ACTION_STATE.INCOMPLETE;
                    case ACTION_STATE.INCOMPLETE:
                        return ACTION_STATE.COMPLETE;
                    case ACTION_STATE.COMPLETE:
                        // If the progress is 100, then switch to PAUSED. Otherwise, cycle to INCOMPLETE.
                        return progress == 100 ? ACTION_STATE.PAUSED : ACTION_STATE.INCOMPLETE;
                }
            }

            // Calculate the progress for the current action
            const progress = getActionProgress(state, uuid);

            currentAction.state = setNextState(currentAction.state, progress);
        },
        updateParentState: (state, action) => {
            const { parentUuid } = action.payload;
            if (!parentUuid) return;

            const dependentActions = state.actions.filter(e => e.parentUuid == parentUuid);
            const actionableDependents = dependentActions.filter(e => e.state !== ACTION_STATE.PAUSED);

            // If there are no actionable dependents, don't change the parent's state.
            if (actionableDependents.length === 0) return;

            if (actionableDependents.every(e => e.state == ACTION_STATE.COMPLETE)) {
                const parentAction = state.actions.find(e => e.uuid == parentUuid);
                parentAction.state = ACTION_STATE.COMPLETE;
            } else if (actionableDependents.some(e => e.state == ACTION_STATE.INCOMPLETE)) {
                const parentAction = state.actions.find(e => e.uuid == parentUuid);
                parentAction.state = ACTION_STATE.INCOMPLETE;
            }
        },
        setState: (state, action) => {
            const { uuid, newState } = action.payload;
            const currentAction = state.actions.find((e) => e.uuid == uuid)
            currentAction.state = newState;
        },
        setActiveAction: (state, action) => {
            const { uuid } = action.payload;
            state.activeAction = uuid;
        }
    }
})

/**
 * 
 * @param {any} state 
 * @param {string} uuid 
 * @returns {string|null}
 */
export const ActionDescriptionSelector = (state, uuid) => {
    return state.datastream.actions.find((e) => e.uuid == uuid)?.description
}

/**
 * 
 * @param {any} state 
 * @param {string} uuid 
 * @returns {string|null}
 */
export const ActionTitleSelector = (state, uuid) => {
    return state.datastream.actions.find((e) => e.uuid == uuid)?.title
}

function getActionProgress(state, uuid) {
    const action = state.actions.find((e) => e.uuid == uuid);

    if (action == null) {
        return 0;
    }

    const dependentActions = state.actions.filter((e) => e.parentUuid == uuid && (e.state == ACTION_STATE.COMPLETE || e.state == ACTION_STATE.INCOMPLETE));
    const totalDependents = dependentActions.length;
    if (totalDependents == 0) {
        return action.state == ACTION_STATE.COMPLETE ? 100 : 0;
    }

    const completedDependents = dependentActions.reduce((acc, action) => (
        action.state == ACTION_STATE.COMPLETE ? acc + 1 : acc
    ), 0)

    const completion = Math.floor(100 * (completedDependents / totalDependents));

    return completion;
}

export const ActionProgressSelector = (state, uuid) => {
    return getActionProgress(state.datastream, uuid);
}

export const ActionsSelector = (state, uuids = []) => {
    if (uuids.length == 0) return []
    return state.datastream.actions.filter(each => uuids.includes(each.uuid))
}

export const ActionsCountSelector = (state) => {
    return state.datastream.actions.length;
}

function getDependentActions(state, parentUuid) {
    const dependents = state.actions.filter((e) => e.parentUuid == parentUuid);
    return dependents;
}

export const DependentActionsSelector = (state, parentUuid) => {
    return getDependentActions(state.datastream, parentUuid);
}

export const ActionStateSelector = (state, uuid) => {
    return state.datastream.actions.find((e) => e.uuid == uuid).state;
}

export const ActionActiveSelector = (state) => {
    return state.datastream.activeAction;
}

export const DatastreamRatioSelector = (state, id) => {
    return {
        n: state.datastream.actions.filter((e) => e.parentUuid == id && e.state == ACTION_STATE.COMPLETE).length,
        d: state.datastream.actions.filter((e) => e.parentUuid == id && e.state !== ACTION_STATE.PAUSED).length
    }
}

export const actionTitlesSelector = (state) => {
    const actionsList = state.datastream.actions.map((e) => ({
        label: e.title,
        value: e.uuid
    }))

    actionsList.push({
        label: state.datashed.datastreams.filter((each) => each.uuid == state.datashed.currentFocus)[0].name,
        value: '',
    })

    return actionsList
}

export const actionSelector = (state, uuid) => {
    return state.datastream.actions.find((e) => e.uuid == uuid)
}

const {
    addAction
} = DatastreamState.actions

export const {
    setActions,
    updateAction,
    deleteAction,
    cycleState,
    updateParentState,
    setState,
    setActiveAction
} = DatastreamState.actions;

const updateAllParentStates = (uuid) => (dispatch, getState) => {
    let currentAction = getState().datastream.actions.find(e => e.uuid == uuid);
    while (currentAction && currentAction.parentUuid) {
        dispatch(updateParentState({ parentUuid: currentAction.parentUuid }));
        currentAction = getState().datastream.actions.find(e => e.uuid == currentAction.parentUuid);
    }
};

export const toggleAndCheckParent = (uuid) => (dispatch, getState) => {
    dispatch(cycleState({ uuid }));
    dispatch(updateAllParentStates(uuid));
};

export const allActionsSelector = (state) => {
    return state.datastream.actions
}

export const addDatastreamAction = (newAction) => (dispatch, getState) => {
    const state = getState()
    const currentFocus = currentFocusSelector(state)
    const uuid = uuidv4()

    newAction["uuid"] = uuid

    dispatch(addAction({
        newAction
    }))

    if(newAction.parentUuid == '') {
        dispatch(addActionToDatastream({datastreamUuid: currentFocus, actionUuid: uuid}))
    }
}

export default DatastreamState.reducer;
