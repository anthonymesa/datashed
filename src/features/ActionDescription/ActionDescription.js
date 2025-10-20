import { ActionDescriptionSelector } from "../Datastream/DatastreamSlice"
import { useSelector } from "react-redux";
import { Text, Card } from "@mantine/core";
import styled from "styled-components";

const Container = styled.div`
    display: ${
        props => props.hide ? 'none' : 'block' 
    };
`

const ActionDescription = ({ uuid }) => {
    const description = useSelector((state) => ActionDescriptionSelector(state, uuid));

    return (
        <Container hide={description == '' ? true : undefined}>
            <Card style={{zIndex: 2}} shadow="sm" padding="lg" radius="md" withBorder>
                <pre style={{ whiteSpace: 'pre-wrap' }}><Text>{description}</Text></pre>
            </Card>
        </Container>
    )
}

export default ActionDescription