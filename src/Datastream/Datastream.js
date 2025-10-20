import {
  Button,
  Card,
  Group,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  Modal,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import ActionsList from "../ActionsList/ActionsList";
import backend from "../utils/Backend";
import NewDatastreamModal from "../NewDatastreamModal/NewDatastreamModal";
import NewActionModal from "../NewActionModal/NewActionModal";

function Datastream(datastream) {
  const { id, title, description } = datastream;
  const actions = datastream?.expand?.actions ?? [];
  const [
    openedNewDatastream,
    { open: openNewDatastream, close: closeNewDatastream },
  ] = useDisclosure(false);
  const [openedNewAction, { open: openNewAction, close: closeNewAction }] =
    useDisclosure(false);

  const handleLogOut = () => {
    backend.authStore.clear();
  };

  const recursivelyDelete = (actions) => {
    actions.forEach((action) => {
      backend
        .collection("actions")
        .getOne(action.id, {
          sort: "+created",
          expand: "actions",
          requestKey: null,
        })
        .then((action) => {
          const subActions = action?.expand?.actions ?? [];
          if (subActions.length > 0) {
            recursivelyDelete(subActions);
          }
          backend.collection("actions").delete(action.id);
        });
    });
  };

  const deleteDatastream = () => {
    backend.collection("datastreams").delete(id);
    recursivelyDelete(actions);
  };

  return (
    <>
      <ScrollArea h={`100vh`}>
        <Stack>
          <Group justify="space-between">
            <Text>{title}</Text>
            <Menu shadow="md" width={200}>
              <MenuTarget>
                <Button>:</Button>
              </MenuTarget>

              <MenuDropdown>
                <MenuLabel>Create New</MenuLabel>

                <MenuItem onClick={openNewDatastream}>Datastream</MenuItem>
                <MenuItem onClick={openNewAction}>Action</MenuItem>
                <MenuDivider />
                <MenuItem color="red" onClick={deleteDatastream}>
                  Delete Datastream
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
              </MenuDropdown>
            </Menu>
          </Group>
          <Card>
            <Text>{description}</Text>
          </Card>
          <ActionsList actions={actions} />
        </Stack>
      </ScrollArea>

      <Modal
        opened={openedNewDatastream}
        onClose={closeNewDatastream}
        title="Create Datastream"
      >
        <NewDatastreamModal id={id} close={closeNewDatastream} />
      </Modal>

      <Modal
        opened={openedNewAction}
        onClose={closeNewAction}
        title="Create Action"
      >
        <NewActionModal
          id={id}
          actions={datastream.actions}
          isRoot={true}
          close={closeNewAction}
        />
      </Modal>
    </>
  );
}

export default Datastream;
