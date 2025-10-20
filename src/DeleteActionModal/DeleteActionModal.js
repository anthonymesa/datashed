import { Button, Stack, Text } from "@mantine/core";
import backend from "../utils/Backend";

function DeleteActionModal({ action, close }) {
  const getAction = (id) =>
    backend.collection("actions").getOne(id, {
      sort: "+created",
      expand: "actions",
      requestKey: null,
    });

  const recursivelyDelete = async (actions) => {
    actions.forEach(async (each) => {
      const actionToDelete = await getAction(each.id);

      const subActions = actionToDelete?.expand?.actions ?? [];
      if (subActions.length > 0) {
        recursivelyDelete(subActions);
      }

      const cloneActions = await backend.collection("actions").getFullList({
        filter: `cloneRef = "${actionToDelete.id}"`,
        requestKey: null,
      });

      cloneActions.forEach(
        async (each) => await backend.collection("actions").delete(each.id)
      );
      await backend.collection("actions").delete(actionToDelete.id);
    });
  };

  const handleDeleteAction = async () => {
    const cloneActions = await backend.collection("actions").getFullList({
      filter: `cloneRef = "${action.id}"`,
      requestKey: null,
    });

    cloneActions.forEach(
      async (each) => await backend.collection("actions").delete(each.id)
    );
    await recursivelyDelete(action.subActions);
    await backend.collection("actions").delete(action.id);
  };

  return (
    <Stack>
      <Text>
        Are you sure? This will delete this action, its descendant action tree,
        and all clones (if any) of this action or its descendants.
      </Text>
      <Button onClick={handleDeleteAction}>Confirm</Button>
    </Stack>
  );
}

export default DeleteActionModal;
