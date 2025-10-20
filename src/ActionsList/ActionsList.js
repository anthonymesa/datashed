import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Button,
  Card,
  Center,
  Group,
  Modal,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import backend from "../utils/Backend";
import NewActionModal from "../NewActionModal/NewActionModal";
import { useDisclosure } from "@mantine/hooks";
import EditActionModal from "../EditActionModal/EditActionModal";
import CloneActionModal from "../CloneActionModal/CloneActionModal";
import DeleteActionModal from "../DeleteActionModal/DeleteActionModal";

function Action(action) {
  const [subActions, setSubActions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actions, setActions] = useState([]);
  const [internalAction, setInternalAction] = useState(action);

  const [openedNewAction, { open: openNewAction, close: closeNewAction }] =
    useDisclosure(false);
  const [openedEditAction, { open: openEditAction, close: closeEditAction }] =
    useDisclosure(false);
  const [
    openedCloneAction,
    { open: openCloneAction, close: closeCloneAction },
  ] = useDisclosure(false);
  const [
    openedDeleteAction,
    { open: openDeleteAction, close: closeDeleteAction },
  ] = useDisclosure(false);

  const updateAction = (action) => {
    setTitle(action.title);
    setDescription(action.description);
    setActions(action.actions);
    setSubActions(action?.expand?.actions ?? []);
  };

  // Update action object whenever title or description changes
  useEffect(() => {
    setInternalAction((prevAction) => ({
      ...prevAction,
      title,
      description,
    }));
  }, [title, description]);

  const updateSubActions = async () => {
    const response = await backend
      .collection("actions")
      .getOne(`${action.id}`, {
        sort: "+created",
        expand: "actions",
        requestKey: null,
      });
    updateAction(response);
  };

  const subscribeToAction = () => {
    backend.collection("actions").subscribe(
      `${action.id}`,
      function (e) {
        updateAction(e.record);
      },
      {
        sort: "+created",
        expand: "actions",
        requestKey: null,
      }
    );
  };

  const unsubscribeFromAction = () => {
    backend.collection("actions").unsubscribe(`${action.id}`);
  };

  useEffect(() => {
    updateSubActions();
    subscribeToAction();

    return () => {
      unsubscribeFromAction();
    };
  }, []);

  return (
    <>
      <AccordionItem key={action.id} value={action.id}>
        <AccordionControl>{title}</AccordionControl>
        <AccordionPanel>
          {action?.description && (
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              {action.description}
            </Card>
          )}
          <ActionsList actions={subActions} />
          <Center>
            <Group>
              <Button onClick={openNewAction}>Add</Button>
              <Button onClick={openEditAction}>Edit</Button>
              <Button onClick={openCloneAction}>Clone</Button>
              <Button onClick={openDeleteAction}>Delete</Button>
            </Group>
          </Center>
        </AccordionPanel>
      </AccordionItem>

      <Modal
        opened={openedNewAction}
        onClose={closeNewAction}
        title="Create Action"
      >
        <NewActionModal
          id={action.id}
          actions={actions}
          isRoot={false}
          close={closeNewAction}
        />
      </Modal>

      <Modal
        opened={openedEditAction}
        onClose={closeEditAction}
        title="Edit Action"
      >
        <EditActionModal action={internalAction} close={closeEditAction} />
      </Modal>

      <Modal
        opened={openedCloneAction}
        onClose={closeCloneAction}
        title="Clone Action"
      >
        <CloneActionModal action={action} close={closeCloneAction} />
      </Modal>

      <Modal
        opened={openedDeleteAction}
        onClose={closeDeleteAction}
        title="Delete Action"
      >
        <DeleteActionModal
          action={{ ...action, subActions }}
          close={closeDeleteAction}
        />
      </Modal>
    </>
  );
}

function Clone(action) {
  const [sourceAction, setSourceAction] = useState({});
  const handleDeleteAction = () => {
    backend.collection("actions").delete(action.id);
  };

  const getClonedData = async () => {
    const original = await backend
      .collection("actions")
      .getOne(action.cloneRef, {
        expand: "actions",
        requestKey: null,
      })
      .catch((e) => console.error(e));

    setSourceAction(original);
  };

  useEffect(() => {
    getClonedData();
  }, []);

  return (
    <AccordionItem key={action.id} value={action.id}>
      <AccordionControl>{sourceAction?.title ?? ""}</AccordionControl>
      <AccordionPanel>
        {sourceAction?.description && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {sourceAction.description}
          </Card>
        )}
        <Center>
          <Group>
            <Button onClick={handleDeleteAction}>Delete</Button>
          </Group>
        </Center>
      </AccordionPanel>
    </AccordionItem>
  );
}

function ActionsList({ actions }) {
  const list = useMemo(
    () =>
      actions.map((each) =>
        each.clone ? (
          <Clone key={each.id} {...each} />
        ) : (
          <Action key={each.id} {...each} />
        )
      ),
    [actions]
  );

  return <Accordion>{list}</Accordion>;
}

export default ActionsList;
