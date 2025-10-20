import { Button, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import backend from "../utils/Backend";

function NewDatastreamModal({ close }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
      actions: [],
    };

    backend
      .collection("datastreams")
      .create(data)
      .then(() => {
        close();
      });
  };

  return (
    <Stack>
      <TextInput
        label="Title"
        placeholder="e.g. Shopping List"
        value={title}
        onChange={handleTitleChange}
      />
      <TextInput
        label="description"
        value={description}
        onChange={handleDescriptionChange}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </Stack>
  );
}

export default NewDatastreamModal;
