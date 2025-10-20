import { ActionIcon } from "@mantine/core"
import { FiEdit } from "react-icons/fi"
import { useDispatch } from "react-redux"
import { setParentId, openModal, setUuid} from "../ModalActionEdit/ModalActionEditSlice"

const ActionIconEdit = ({ uuid }) => {

    const dispatch = useDispatch();

    const handleOnClick = () => {
        dispatch(setUuid({value: uuid}))
        dispatch(openModal({}))
    }

    const props = {
        variant: "subtle",
        className: "edit-bar-icon",
        onClick: handleOnClick,
    }

    return (
        <ActionIcon {...props}>
            <FiEdit />
        </ActionIcon>
    )
}

export default ActionIconEdit