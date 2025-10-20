import { Modal, Title, Text, NavLink } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

const DemoModal = () => {

    const [opened, { open, close }] = useDisclosure(true);

    return (
        <Modal centered size={"85%"} title="Welcome!" opened={opened} onClose={close}>
            <Title>Datastream v1.0</Title>
            <Text>This is a demo of version 1.0 of Datastream. Datastream is a task management and scheduling application, some of the features include:</Text>
            <ul>
                <li>Create, edit, and delete actions (tasks/events) in a datastream that can be nested infinitely.</li>
                <li>Easily manage task dependency completion states.</li>
                <li>List view ensures 'infinite nesting' will never push its way off screen.</li>
            </ul>
            <Text>This application is still currently under development as of 09/18/2023, and there are many more updates planned so stay tuned. To submit an issue, you can do so on the project <a href="https://github.com/anthonymesa/enigma-project-manager" >Github</a>, or you can <a href="mailto:admesa@pm.me?subject=Feedback for Datastream&body=Hello, I wanted to share my feedback about Datastream.">email me</a>.</Text>
        </Modal>
    )
}

export default DemoModal