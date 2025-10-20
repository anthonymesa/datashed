import { ActionIcon } from "@mantine/core"
import { FiTrash2 } from "react-icons/fi"
import { deleteAction } from "../Datastream/DatastreamSlice"
import { useDispatch } from "react-redux"

const ActionIconDelete = ({ uuid }) => {

    const dispatch = useDispatch();

    const handleOnClick = () => {
        dispatch(deleteAction({ uuid: uuid }))
    }

    const props = {
        variant: "subtle",
        className: "edit-bar-icon",
        onClick: handleOnClick,
    }

    return (
        <ActionIcon {...props}>
            <FiTrash2 />
        </ActionIcon>
    )
}

export default ActionIconDelete