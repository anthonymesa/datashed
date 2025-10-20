import { Carousel } from "@mantine/carousel";
import Datastream from "../Datastream/Datastream";
import { Center, ScrollArea, Text } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { allDatastreamsSelector, setCurrent, setDatastreams } from "./DatashedSlice";
import MenuIcon from "../MenuIcon/MenuIcon";
import { useEffect } from "react";
import BackendConnector from "../../app/BackendConnector";
import { setActions } from "../Datastream/DatastreamSlice";

export default function Datashed() {
    const datastreams = useSelector(allDatastreamsSelector)
    const backend = BackendConnector();
    const dispatch = useDispatch();

    useEffect(() => {
        backend.getDatastreams((data) => {
            dispatch(setDatastreams({datastreams: data}))
        })
        backend.getActions((data) => {
            dispatch(setActions({actions: data }))
        })
    }, [])

    const handleSlideChange = (index) => {
        dispatch(setCurrent({index: index}))
    }

    return (
        <>
            <MenuIcon />

            {datastreams.length > 0 ? <Carousel onSlideChange={handleSlideChange} slideSize="100%" slideGap="xs" controlsOffset="xs" controlSize={14} withControls={false}>
                {
                    datastreams.map(each => (
                        <Carousel.Slide key={each.uuid}>
                            <ScrollArea h={window.innerHeight} type="never">
                                <Datastream {...each}/>
                            </ScrollArea>
                        </Carousel.Slide>
                    ))
                }
            </Carousel> : <></>}

            {datastreams.length == 0 
                ? (<Center h="100vh"><Text>Create a new Datastream with the menu below.</Text></Center>)
                : (<></>)
            } 
        </>
    )
}