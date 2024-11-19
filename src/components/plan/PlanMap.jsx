import { Box, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet'
import pin_icon_black from '../../assets/markers/pin_icon_black.png'

const icon = new Icon({
    iconUrl: pin_icon_black,
    iconSize: [75, 75],
    html: '<div style="background-color: red; width: 50px; height: 50px; border-radius: 50%;"></div>'
})

export default function PlanMap(props) {
    const theme = useTheme()

    const [center, setCenter] = React.useState([0, 0])
    const [zoom, setZoom] = React.useState(10)

    useEffect(() => {

        // Calculating center of map based on average of all markers
        const total = props.markers.reduce((acc, marker) => {
            return [acc[0] + marker.position[0], acc[1] + marker.position[1]];
        }, [0, 0]);

        const tempCenter = [total[0] / props.markers.length, total[1] / props.markers.length];
        setCenter(tempCenter)
        console.log("Center", center)

        // Adapting zoom level based on distance between markers
        const difference = props.markers.reduce((acc, marker) => {
            const distance = Math.sqrt((marker.position[0] - center[0]) ** 2 + (marker.position[1] - center[1]) ** 2);
            return Math.max(acc, distance);
        }, 0);

        // Zoom level is inversely proportional to distance
        const tempZoom = Math.round(14 - Math.log2(difference / 0.01));
        setZoom(tempZoom)
        console.log("Zoom", zoom)

        console.log("Markers", props.markers)

    }, [props.markers])

    return (
        <Box
            height={500}
            sx={{
                backgroundColor: theme.palette.primary.light,
                borderRadius: '10px',
                overflow: 'hidden'
            }}
        >
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}>
                <Map markers={props.markers} attribution={props.attribution} />
            </MapContainer>
        </Box>
    )
}

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
                <Marker key={index} position={marker.position} icon={icon}>
                    <Popup>{marker.popup}</Popup>
                </Marker>
            ))
            }
        </>

    )
}