import ActionDescription from "../ActionDescription/ActionDescription"
import ActionEditBar from "../ActionEditBar/ActionEditBar"
import {useSelector} from 'react-redux'
import {ActionActiveSelector, ActionDescriptionSelector} from '../Datastream/DatastreamSlice'
import styled from "styled-components"

const Container = styled.div`
    padding-left: 1rem;
    padding-right: 1rem;
    padding-bottom: 1rem;
    margin-bottom: ${
        props => props.active ? '0' : '-2.5rem'
    };
    transition: margin-bottom 1s ease;
`

const ActionDatumContent = ({ uuid }) => {
  
    const activeAction = useSelector(ActionActiveSelector);
    return (
        <Container active={activeAction === uuid ? true : undefined}>
            <ActionDescription uuid={uuid} />
            <ActionEditBar uuid={uuid} />
        </Container>
    )
}

export default ActionDatumContent;