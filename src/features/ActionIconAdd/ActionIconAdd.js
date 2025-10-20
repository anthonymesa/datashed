import { ActionIcon } from "@mantine/core"
import { FiPlusSquare } from "react-icons/fi"
import { useDispatch } from "react-redux"
import { setParentId, openModal } from "../ModalActionAdd/ModalActionAddSlice"
import "../ActionEditBar/ActionEditBar.css"
import { TextInput, Button } from '@mantine/core'

const ActionIconAdd = ({ uuid }) => {

    const dispatch = useDispatch();
      
    const handleOnClick = () => {
        dispatch(setParentId({ value: uuid }))
        dispatch(openModal({}));
    }

    const props = {
        variant: "subtle",
        size: "xl",
        className: "edit-bar-icon",
        onClick: handleOnClick,
    }

    return (
        <ActionIcon {...props}>
            <FiPlusSquare />
        </ActionIcon>
    )
}

export default ActionIconAdd