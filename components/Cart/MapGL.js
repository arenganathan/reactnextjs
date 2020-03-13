import React, {useState, useEffect, useContext} from "react";
import ReactMapGL, {NavigationControl, Marker, Popup} from "react-map-gl"
import PinIcon from "./PinIcon";
import { green } from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
}

const Map = ({zipcodes}) => {

    //const { zipcodes } = this.props;
    const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
    const [userPosition, setUserPosition] = useState(null)
    const [popup, setPopup] = useState(null)
  
    useEffect(() => {
        getUserPosition()
    }, [])

    const getUserPosition = () => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setViewport({ ...viewport, latitude, longitude });
            setUserPosition({ latitude, longitude });
          });
        }
    };

    const handleSelectPin = zipC => {
        setPopup(zipC)        
    }

    return (
        <div style={{display: "flex"}}>
        <ReactMapGL
            width="100vw"
            height="calc(100vh - 64px)"
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxApiAccessToken="pk.eyJ1IjoiYXJlbmdhbmF0aGFuIiwiYSI6ImNrNzQ0bjM1ejBpNzUza3FrYzcydzdjZXoifQ.EtdNUCk4giNBxDdsX3ODhQ"
            scrollZoom={true}  
            onViewportChange={newViewport => setViewport(newViewport)}        
            {...viewport}     
        >
            <div style={{ position: "absolute",top: 0,left: 0,margin: "1em"}}>
            <NavigationControl 
                onViewportChange={newViewport => setViewport(newViewport)}
            />
            </div>  

            {/* Pins for User Current Position */}
            { userPosition && (
            <Marker
                latitude={userPosition.latitude}
                longitude={userPosition.longitude}
                offsetLeft={-19}
                offsetTop={-37}
            >                
                <PinIcon size={40} color="red" />

            </Marker>
            )}

            {/* Biggest Pop City Statewise */}
            { zipcodes && zipcodes.map(zipC => (
            <Marker
                key={zipC.biggestCity.name}
                latitude={zipC.biggestCity.loc[1]}
                longitude={zipC.biggestCity.loc[0]}
                offsetLeft={-19}
                offsetTop={-37}
            >                
                <PinIcon size={40} color="hotpink" onClick={() => handleSelectPin(zipC.biggestCity)}/>

            </Marker>
            ))}

            {/* Smallest Pop City Statewise */}
            { zipcodes && zipcodes.map(zipC => (
            <Marker
                key={zipC.smallestCity.name}
                latitude={zipC.smallestCity.loc[1]}
                longitude={zipC.smallestCity.loc[0]}
                offsetLeft={-19}
                offsetTop={-37}
            >                
                <PinIcon size={40} color="green" onClick={() => handleSelectPin(zipC.smallestCity)}/>

            </Marker>
            ))}

            {/* Popup screen for the selected Pin */}
            {popup && (
            <Popup
              anchor="top"
              latitude={popup.loc[1]}
              longitude={popup.loc[0]}
              closeOnClick={false}
              onClose={() => setPopup(null)}
            >    
                <div style={{display: "flex",alignItems: "center",justifyContent: "center",flexDirection: "column"}}>
                <Typography>
                  {popup.name} - {popup.pop} (Pop)
                </Typography>
                </div>  
                
            </Popup>
            )}

      </ReactMapGL>    

    </div>
  );
};

export default Map;
