import { Accordion, Paper, Card, Title, Text, Group, Stack, Center } from "@mantine/core"
import ActionDatumHeader from "../ActionDatumHeader/ActionDatumHeader"
import ActionDatumContent from "../ActionDatumContent/ActionDatumContent"
import { useDispatch, useSelector } from "react-redux"
import { ActionsCountSelector, ActionsSelector, DatastreamRatioSelector, DependentActionsSelector, setActiveAction } from "./DatastreamSlice"
import { FiChevronRight } from "react-icons/fi"
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import styled from "styled-components"
import { actionNamesSelector } from "../Datashed/DatashedSlice"

const Action = styled.div`
    overflow: hidden;
    position: relative;
    padding-bottom: 1rem;
    padding-top: 1rem;
`

const ShadowBar = styled.div`
    display: block;
    position: relative;
    width: 100%;
    height: 100px;
    background: blue;
`

const TopInsetShadow = styled(ShadowBar)`
    top: calc(-100px - 1rem);
    box-shadow: ${
        props => props.hide ? '' : '0 0 0.25rem 0.25rem rgba(0, 0, 0, 0.10)'
    };
`

const BottomInsetShadow = styled(ShadowBar)`
    margin-top: -100px;
    bottom: calc(-100px - 1rem);
    box-shadow: ${
        props => props.hide ? '' : '0 0 0.25rem 0.25rem rgba(0, 0, 0, 0.10)'
    };
`

const EmptyMessageContainer = styled.div`
    width: 100%; 
    display: flex;
    justifyContent: center;
    textAlign: center;
    position: relative;
    height: calc(100vh - 11rem);
`

const EmptyMessage = styled(Text)`
    width: 50%;
    position: absolute;
    bottom: 25%;
    transform: translate(0, 0%);
`

const ActionList = forwardRef(({ parentUuid, datastreamUuid = ''}, ref) => {
    const datastreamActionsNames = useSelector((state) => actionNamesSelector(state, datastreamUuid))
    const datastreamActions = useSelector((state) => ActionsSelector(state, datastreamActionsNames))
    const dependentActions = useSelector((state) => DependentActionsSelector(state, parentUuid))

    let actions
    if (parentUuid == '') {
        actions = datastreamActions.length != 0 ? datastreamActions : []
    } else {
        actions = dependentActions
    }

    const dispatch = useDispatch();
    const [accordionValue, setAccordionValue] = useState(null);
    const childAccordionRef = useRef();

    // Reset child accordion when accordionValue changes
    useEffect(() => {
        if (childAccordionRef.current) {
            childAccordionRef.current.resetAccordion()
        }
    }, [accordionValue])

    // Expose a method to parent components to reset this accordion
    useImperativeHandle(ref, () => ({
        resetAccordion: () => {
            setAccordionValue(null);
        }
    }), [accordionValue]);
    
    if (actions.length === 0) {
        if (parentUuid === '') {
            return (
                <Center style={{width: "100vw", position: "absolute", bottom: "11rem"}} c="dimmed" fs="italic">
                    Use the menu below to create a new Datum!
                </Center>
            )
        } else {
            return null;
        }
    }

    const childActions = actions.map(action => (
        <Accordion.Item key={action.uuid} value={action.uuid}>
            <ActionDatumHeader uuid={action.uuid}>{action.title}</ActionDatumHeader>
            <Accordion.Panel>
                <ActionDatumContent uuid={action.uuid} />
                {actions.length > 0 &&
                    <ActionList ref={childAccordionRef} parentUuid={action.uuid} />
                }
            </Accordion.Panel>
        </Accordion.Item>
    ))

    const mantineStyleApi = {
        chevron: {
            '&[data-rotate]': {
                transform: 'rotate(90deg)',
            },
        },
        content: {
            padding: "0px",
        },
        control: {
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
        },
        item: {
            marginTop: "-100px",
            paddingBottom: "-100px",

            '&[data-active]': {
                border: '0px solid transparent',
                borderRadius: '0px'
            },
        },
        panel: {
        }
    }

    const handleChange = (value) => {
        if (value == null) {
            setAccordionValue(null)
            dispatch(setActiveAction({ uuid: parentUuid }));
        } else {
            setAccordionValue(value)
            dispatch(setActiveAction({ uuid: value }));
        }
    }

    const accordionProps = {
        multiple: false,
        variant: "separated",
        chevron: <FiChevronRight />,
        value: accordionValue,
        onChange: handleChange,
        styles: mantineStyleApi,
        chevronPosition: "left",
    }
    
    return (
        <Action>
            <TopInsetShadow hide={parentUuid == '' ? true : undefined}/>
            <Accordion {...accordionProps}>
                {childActions}
            </Accordion>
            <BottomInsetShadow hide={parentUuid == '' ? true : undefined}/>
        </Action>
    );
})

const Datastream = ({ uuid, name, description }) => {
    const actionLength = useSelector(ActionsCountSelector)
    const { n, d } = useSelector((state) => DatastreamRatioSelector(state, ''));
    const bottomPadding = actionLength > 0 ? '6rem' : '0rem'

    return (
        <Stack style={{ marginBottom: bottomPadding }} >
            <Card style={{ width: 'calc(100% - 2rem)', left: '50%', transform: 'translate(calc(-50% - 1rem) , 0)', margin: '1rem' }} shadow="sm" padding="lg" radius="md" withBorder>
                <Group style={{ width: '100%' }}>
                    <Stack style={{ flexGrow: 1 }}>
                        <Title>{name}</Title>
                        <Text>{description}</Text>
                    </Stack>
                    <Stack style={{ flexGrow: 0 }}>
                        <Title>{n + "/" + d}</Title>
                    </Stack>
                </Group>
            </Card>
            <ActionList parentUuid={''} datastreamUuid={uuid} />
        </Stack>
    )
}

export default Datastream;