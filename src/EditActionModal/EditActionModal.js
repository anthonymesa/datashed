import {
  Box,
  Button,
  Loader,
  LoadingOverlay,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import backend from "../utils/Backend";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import GroupedSelect from "./GroupedSelect";

function EditActionModal({ action, close }) {
  const [parent, setParent] = useState("");
  const [selectData, setSelectData] = useState([]);
  const [selectValue, setSelectValue] = useState(null);
  const [visible, { toggle }] = useDisclosure(true);
  const [title, setTitle] = useState(action.title);
  const [description, setDescription] = useState(action.description);

  const getDatastreams = () =>
    backend.collection("datastreams").getFullList({
      sort: "+created",
      expand: "actions",
      requestKey: null,
    });

  const getActions = () =>
    backend.collection("actions").getFullList({
      sort: "+created",
      expand: "actions",
      requestKey: null,
    });

  const getSelectData = async () => {
    const datastreams = await getDatastreams();
    const actions = await getActions();

    const datastreamParent =
      datastreams.filter((each) => each.actions.includes(action.id))?.[0] ??
      null;
    const actionsParent =
      actions.filter((each) => each.actions.includes(action.id))?.[0] ?? null;

    const parent = datastreamParent ?? actionsParent ?? null;

    if (parent == null) {
      console.error("no parent found");
      return;
    }

    setParent(parent);

    const makeSelectOption = (parent) => {
      return {
        label: parent.title,
        value: parent.id,
        type: parent.collectionName,
        actions: parent?.expand?.actions ?? [],
      };
    };

    const isNotSelf = (each) => each.id != action.id;

    const getDescendantActionIds = () => {
      const DescendantTracker = () => {
        const nonDescendants = [];

        const push = (element) => {
          nonDescendants.push(element);
        };

        const get = () => {
          return nonDescendants;
        };

        return {
          push,
          get,
        };
      };

      const descendantTracker = DescendantTracker();

      function gatherDescendants(actionId) {
        descendantTracker.push(actionId);
        const childActions =
          actions.find((each) => each.id == actionId)?.actions ?? [];
        childActions.forEach((each) => gatherDescendants(each));
      }

      action.actions.forEach((each) => gatherDescendants(each));

      return descendantTracker.get();
    };

    const descendantActionIds = getDescendantActionIds();
    const nonDescendantActions = actions.filter(
      (each) => !descendantActionIds.includes(each.id)
    );

    const newData = [
      ...datastreams
        .filter((each) =>
          parent.collectionName == "datastreams" ? each.id != parent.id : true
        )
        .map(makeSelectOption),
      ...nonDescendantActions
        .filter((each) =>
          parent.collectionName == "actions" ? each.id != parent.id : true
        )
        .filter(isNotSelf)
        .map(makeSelectOption),
    ];

    setSelectData(newData);
  };

  useEffect(() => {
    getSelectData().then(() => {
      toggle();
    });
  }, []);

  const handleSelectChange = (value) => {
    setSelectValue(value);
  };

  const selectionLoader = visible ? <Loader /> : <></>;

  const SelectParent = () => {
    return (
      <GroupedSelect
        leftSection={selectionLoader}
        disabled={visible}
        data={selectData}
        value={selectValue}
        onChange={handleSelectChange}
        placeholder={parent.title}
        label="Parent"
      />
    );
  };

  const moveActionToNewParent = () => {
    const updateDestination = () =>
      backend
        .collection(selectData.find((each) => each.value == selectValue).type)
        .update(selectValue, {
          actions: [
            ...selectData
              .find((each) => each.value == selectValue)
              .actions.map((each) => each.id),
            action.id,
          ],
        })
        .catch((e) => {
          console.error(`error updating detination actions ${e}`);
        });

    const updateParent = () =>
      backend
        .collection(parent.collectionName)
        .update(parent.id, {
          actions: parent.expand.actions
            .map((each) => each.id)
            .filter((each) => each != action.id),
        })
        .catch((e) => {
          console.error(`error updating parent actions ${e}`);
        });

    return updateParent().then(() => updateDestination());
  };

  const updateAction = () =>
    backend
      .collection("actions")
      .update(action.id, {
        title: title || action.title,
        description: description || action.description,
      })
      .catch((e) => {
        console.error(`error updating parent actions ${e}`);
      });

  const handleSubmit = async () => {
    await updateAction();
    if (selectValue !== null) await moveActionToNewParent();
    close();
  };

  return (
    <Stack>
      <SelectParent />
      <TextInput
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        label="Title"
      />
      <TextInput
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        label="Description"
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </Stack>
  );
}

export default EditActionModal;
