import { Button, Select, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import backend from "../utils/Backend";

function NewActionModal({ id, actions, close, isRoot }) {
  const actionStatesList = ["paused", "incomplete", "complete"];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionState, setActionState] = useState(actionStatesList[0]);
  const handleTitleChange = (e) => {
    setTitle(e.currentTarget.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const handleSubmit = () => {
    const data = {
      owner: backend.authStore.model.id,
      title: title,
      description: description,
      clone: false,
      cloneRef: "",
      state: actionState,
      actions: [],
    };

    backend
      .collection("actions")
      .create(data)
      .then((res) => {
        backend
          .collection(isRoot ? "datastreams" : "actions")
          .update(id, { actions: [...actions, res.id] });
        close();
      });
  };
  return (
    <Stack>
      <TextInput
        label="Title"
        placeholder="e.g. Pick up groceries"
        value={title}
        onChange={handleTitleChange}
      />
      <TextInput
        label="description"
        value={description}
        onChange={handleDescriptionChange}
      />
      <Select
        data={actionStatesList}
        value={actionState}
        onChange={setActionState}
      ></Select>
      <Button onClick={handleSubmit}>Submit</Button>
    </Stack>
  );
}

export default NewActionModal;
