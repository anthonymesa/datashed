import { Button, Select, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import backend from "../utils/Backend";

function CloneActionModal({ action, close }) {
  const [parent, setParent] = useState("");
  const [selectData, setSelectData] = useState([]);
  const [selectValue, setSelectValue] = useState("");

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

    setSelectData([
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
    ]);
  };

  const handleSelectChange = (value) => {
    setSelectValue(value);
  };

  useEffect(() => {
    getSelectData();
  }, []);

  const handleSubmit = async () => {
    const data = {
      owner: backend.authStore.model.id,
      title: "",
      description: "",
      clone: true,
      cloneRef: action.id,
      state: "",
      actions: [],
    };

    try {
      const actionClone = await backend.collection("actions").create(data);

      const selected = selectData.find((each) => each.value == selectValue);
      backend.collection(selected.type).update(selectValue, {
        actions: [...selected.actions.map((each) => each.id), actionClone.id],
      });

      close();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Stack>
      <Select
        data={selectData}
        value={selectValue}
        onChange={handleSelectChange}
        placeholder={parent.title}
        label="Destination"
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </Stack>
  );
}

export default CloneActionModal;
