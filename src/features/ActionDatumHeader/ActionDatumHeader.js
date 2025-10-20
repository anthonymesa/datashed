import ActionCompleteGizmo from "../ActionCompleteGizmo/ActionCompleteGizmo"
import { Box } from "@mantine/core";
import { Accordion } from "@mantine/core";

const ActionDatumHeader = (props) => {
    const { uuid } = props;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', zIndex: 2}}>
            <Accordion.Control {...props} />
            <ActionCompleteGizmo uuid={uuid} />
        </Box>
    )
}

export default ActionDatumHeader;