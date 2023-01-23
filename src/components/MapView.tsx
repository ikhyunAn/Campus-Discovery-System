import { Snackbar } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import * as React from 'react';
import Map, { Marker } from 'react-map-gl';

type props = {
  markers: locationType[],
}
type locationType = {
    name : string,
    latitude : number,
    longitude: number,
}
type RSVPtype = 'RSVP' | 'Will Attend' | 'Maybe' | "Won't Attend"

export default function MapView(markers: any) {
  const [viewState, setViewState] = React.useState({
    latitude: 33.776033, //33.776033
    longitude: -84.3988409, // -84.3988409
    zoom: 16
  });

  function MarkerMaker(latitude : number, longitude : number) {
    return <Marker latitude={latitude} longitude={longitude} anchor="bottom" color="red"/>
  }

  return (
    <div>
      <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{width: "100vw", height: "100vh"}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={"pk.eyJ1IjoidHVza2FjdDQiLCJhIjoiY2xhenUzODJvMDYyZTNucGZjNWc0NmI5YiJ9.4ywxAbbTMupVzQn0XgV5Ew"}
      >
      {console.log(markers[0])}
      {MarkerMaker(33.7771562, -84.3962024)}
      </Map>
      
    </div>
  );
}