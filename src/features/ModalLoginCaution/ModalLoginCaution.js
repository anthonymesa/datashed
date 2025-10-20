import { Button, Modal } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { closeModalLoginCaution, openedSelector } from "./ModalLoginCautionSlice";
import { allDatastreamsSelector } from "../Datashed/DatashedSlice";
import { allActionsSelector } from "../Datastream/DatastreamSlice";

function ModalLoginCaution() {
    const openedState = useSelector((state) => openedSelector(state))
    const dispatch = useDispatch()
    const datastreams = useSelector(allDatastreamsSelector)
    const actions = useSelector(allActionsSelector)

    const handleOnClose = () => {
      dispatch(closeModalLoginCaution({}))
    }

    const downloadJson = () => {
        const data = { actions, datastreams };
        const jsonString = JSON.stringify(data, null, 2); // null and 2 are for formatting purposes
        const blob = new Blob([jsonString], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "data.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleExportClick = () => {
        downloadJson();
    }

    const handleSkipClick = () => {
        window.location.href = `https://auth.snazzyfellas.com/auth?response_type=code&client_id=datastream&redirect_uri=http://localhost:3000/auth&scope=openid+profile+sub`
    }
  
    return (
        <Modal overflow="outside" centered title="Hold on..." opened={openedState} onClose={handleOnClose}>
            <div>
            Logging in will overwrite any changes made while offline. Export your data so that you can import these changes after logging in.

            <div style={{ display: "flex", gap: '1rem', flexDirection: 'row', justifyContent: "right", paddingTop: "1rem" }}>
                <Button onClick={handleExportClick}>Export</Button>
                <Button onClick={handleSkipClick}>Skip</Button>
            </div>
            </div>
        </Modal>
    );
}

export default ModalLoginCaution