import { Title } from "@mantine/core"
import { useSelector } from "react-redux"
import { ActionTitleSelector } from "../Datastream/DatastreamSlice"

const ActionTitle = ({ uuid }) => {

    const title = useSelector((state) => ActionTitleSelector(state, uuid));

    return (
        <Title>{title}</Title>
    )
}

export default ActionTitle;