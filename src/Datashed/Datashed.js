import { useEffect, useMemo, useState } from "react";
import backend from "../utils/Backend";
import "@mantine/carousel/styles.css";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import Datastream from "../Datastream/Datastream";
import NewDatastreamModal from "../NewDatastreamModal/NewDatastreamModal";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function Datashed() {
  const [datastreams, setDatastreams] = useState([]);
  const [
    openedNewDatastream,
    { open: openNewDatastream, close: closeNewDatastream },
  ] = useDisclosure(false);

  const updateDatastreams = async () => {
    const response = await backend.collection("datastreams").getFullList({
      sort: "+created",
      expand: "actions",
      requestKey: null,
    });
    setDatastreams(response);
  };

  const subscribeToDatastreams = () => {
    backend.collection("datastreams").subscribe(
      "*",
      function (e) {
        switch (e.action) {
          case "create":
            setDatastreams((prev) => [
              ...prev.filter((each) => each.id !== e.record.id),
              e.record,
            ]);
            break;
          case "update":
            setDatastreams((prev) => [
              ...prev.map((each) => {
                if (each.id == e.record.id) {
                  return e.record;
                } else {
                  return each;
                }
              }),
            ]);
            break;
          case "delete":
            setDatastreams((prev) =>
              prev.filter((each) => each.id !== e.record.id)
            );
        }
      },
      {
        sort: "+created",
        expand: "actions",
        requestKey: null,
      }
    );
  };

  const unsubscribeFromDatastreams = () => {
    backend.collection("datastreams").unsubscribe("*");
  };

  useEffect(() => {
    updateDatastreams();
    subscribeToDatastreams();

    return () => {
      unsubscribeFromDatastreams();
    };
  }, []);

  const slides = useMemo(
    () =>
      datastreams.map((each) => (
        <CarouselSlide key={each.id}>
          <Datastream {...each} />
        </CarouselSlide>
      )),
    [datastreams]
  );

  if (datastreams.length > 0) {
    return (
      <Carousel withIndicators withControls={false} height={`100vh`}>
        {slides}
      </Carousel>
    );
  } else {
    return (
      <>
        <Modal
          opened={openedNewDatastream}
          onClose={closeNewDatastream}
          title="Create Datastream"
        >
          <NewDatastreamModal close={closeNewDatastream} />
        </Modal>
        <Button onClick={openNewDatastream}>Create New Datastream</Button>
      </>
    );
  }
}

export default Datashed;
