
import { useSelector } from "react-redux";
import ActionIconAdd from "../ActionIconAdd/ActionIconAdd";
import ActionIconDelete from "../ActionIconDelete/ActionIconDelete";
import ActionIconEdit from "../ActionIconEdit/ActionIconEdit";
import "./ActionEditBar.css"
import { ActionActiveSelector } from "../Datastream/DatastreamSlice";

const ActionEditBar = ({ uuid }) => {

    const actionActive = useSelector((state) => ActionActiveSelector(state));

    return (
        <div {...{
            className: `action-edit-bar ${actionActive === uuid ? 'active' : ''}`
        }}>
            <ActionIconAdd uuid={uuid} />
            <ActionIconEdit uuid={uuid} />
            <ActionIconDelete uuid={uuid} />
        </div>
    )
};

export default ActionEditBar;