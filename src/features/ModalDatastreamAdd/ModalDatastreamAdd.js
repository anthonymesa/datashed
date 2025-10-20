import { TextInput, Button, Modal, Textarea } from '@mantine/core';
import { formSelector, setTitle, openedSelector, closeModal, setDescription, clearForm } from './ModalDatastreamAddSlice';
import { useDispatch, useSelector } from "react-redux"
import { addDatastream } from '../Datashed/DatashedSlice';
import { addDatastreamAction } from '../Datastream/DatastreamSlice';

const TitleTextInput = () => {

  const form = useSelector((state) => formSelector(state));
  const dispatch = useDispatch();

  return (
    <div>
      <TextInput
        required
        label="Title"
        placeholder="e.g., Notes"
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
        placeholder="e.g., A stream to keep notes."
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

const SubmitButton = () => {

  const form = useSelector(formSelector)
  const dispatch = useDispatch()

  const handleOnClick = () => {
    dispatch(addDatastream({
      name: form.title,
      description: form.description
    }))
    dispatch(closeModal({}))
    dispatch(clearForm({}))
  }

  return (
    <div>
      <Button onClick={handleOnClick}>
        Create
      </Button>
    </div>
  )
}

const ModalDatastreamAdd = () => {

  const openedState = useSelector((state) => openedSelector(state))
  const dispatch = useDispatch()

  const handleOnClose = () => {
    dispatch(closeModal({}))
  }

  return (
    <Modal overflow="outside" centered title="Add new datastream" opened={openedState} onClose={handleOnClose}>
      <div>
        <TitleTextInput />
        <DescriptionTextbox />
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "1rem" }}>
          <SubmitButton />
        </div>
      </div>
    </Modal>

  );
}

export default ModalDatastreamAdd;