import { Box, useTheme } from '@mui/material'
import React from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'

function Map(props) {
    const map = useMapEvents({
        focus: () => {
            map.scrollWheelZoom.enable()
            map.dragging.enable()
        },
        blur: () => {
            map.scrollWheelZoom.disable()
            map.dragging.disable()
        },
    })

    return (
        <>
            <TileLayer
                attribution={props.attribution ?? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
                url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
            />


            {props.markers.map((marker, index) => (
                <Marker key={index} position={marker.position}>
                    <Popup>{marker.popup}</Popup>
                </Marker>
            ))
            }
        </>

    )
}

export default function PlanMap(props) {
    const theme = useTheme()

    return (
        <Box
            height={500}
            sx={{
                backgroundColor: theme.palette.primary.light,
                borderRadius: '10px',
                overflow: 'hidden'
            }}
        >
            <MapContainer center={[48.857, 2.348]} zoom={13} scrollWheelZoom={false} >
                <Map markers={props.markers} attribution={props.attribution} />
            </MapContainer>
        </Box>
    )
}