import { TextInput, Button, Select, Modal, Textarea } from '@mantine/core';
import { formSelector, setParentId, setTitle, openedSelector, closeModal, setActionState, setDescription, clearForm, uuidSelector } from './ModalActionEditSlice';
import { actionTitlesSelector, updateAction, ACTION_STATE, actionSelector } from '../Datastream/DatastreamSlice'
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from 'react'
import { useDisclosure } from '@mantine/hooks'

const ParentIdSelector = () => {

  const { parentId } = useSelector((state) => formSelector(state));
  const dispatch = useDispatch();
  const actionTitles = useSelector((state) => actionTitlesSelector(state));

  return (
    <div>
      <Select
        required
        searchable
        maxDropdownHeight={100}
        value={parentId}
        label="Parent Action"
        placeholder="Choose one..."
        dropdownPosition="bottom"
        style={{}}
        data={actionTitles}
        onChange={(value) => {
          dispatch(setParentId({ value: value }));
        }}
      />
    </div>
  )
}

const TitleTextInput = () => {

  const form = useSelector((state) => formSelector(state));
  const dispatch = useDispatch();

  return (
    <div>
      <TextInput
        required
        label="Title"
        placeholder=""
        onChange={(event) => {
          dispatch(setTitle({ value: event.currentTarget.value }));
        }}
        value={form.title}
      />
    </div>
  )
}
const DescriptionTextbox = () => {

  const { description } = useSelector(formSelector)
  const dispatch = useDispatch()

  return (
    <div>
      <Textarea
        label="Description"
        placeholder="..."
        autosize
        minRows={4}
        maxRows={8}
        onChange={(event) =>
          dispatch(setDescription({ value: event.currentTarget.value }))
        }
        value={description}
      />
    </div>
  )
}

const TagsGroupSelector = () => {
  return (
    <div>

    </div>
  )
}

const ActionStateSelector = () => {

  const dispatch = useDispatch()

  return (
    <div>
      <Select
        //value={form.parentId}
        label="Action State"
        placeholder="Choose one..."
        dropdownPosition="bottom"
        style={{}}
        data={Object.Values(ACTION_STATE)}
        onChange={(event) => {
          dispatch(setActionState({ value: event.value }));
        }}
      />
    </div>
  )
}

const SubmitButton = () => {

  const form = useSelector(formSelector)
  const dispatch = useDispatch()
  const uuid = useSelector(uuidSelector)

  const handleOnClick = () => {
    dispatch(updateAction({
      uuid: uuid, data: {
        parentUuid: form.parentId,
        title: form.title,
        description: form.description,
        tags: [],
        state: form.state,
      }
    }))
    dispatch(closeModal({}))
    dispatch(clearForm({}))
  }

  return (
    <div>
      <Button onClick={handleOnClick}>
        Edit
      </Button>
    </div>
  )
}

const ModalActionEdit = () => {

  const openedState = useSelector((state) => openedSelector(state))
  const dispatch = useDispatch()
  const uuid = useSelector(uuidSelector)
  const initialAction = useSelector((state) => actionSelector(state, uuid))
  const handleOnClose = () => {
    dispatch(closeModal({}))
  }

  useEffect(() => {
    if (initialAction) {
      dispatch(setParentId({ value: initialAction.parentUuid }))
      dispatch(setTitle({ value: initialAction.title }))
      dispatch(setDescription({ value: initialAction.description }))
      dispatch(setActionState({ value: initialAction.state }))
    }
  }, [initialAction])

  return (
    <Modal overflow="outside" centered title="Edit action" opened={openedState} onClose={handleOnClose}>
      <div>
        <ParentIdSelector />
        <TitleTextInput />
        <DescriptionTextbox />
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "1rem" }}>
          <SubmitButton />
        </div>
      </div>
    </Modal>

  );
}

export default ModalActionEdit;