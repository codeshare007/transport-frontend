import React, { useEffect, useRef, useState } from 'react';
import api from '../../api/base';
import { Box, Typography, Button } from '@mui/material';
import { apiv1 } from '../../api/paths';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import markIcon from './icons/marker-truck.png';
import H, { ui } from "@here/maps-api-for-javascript";
import { useSnackBar } from '../../context/SnackContext';
import { VehicleInfo } from './VehicleInfo';

interface MapProps {
  containerHeight: string;
  data: {
    vehicleType: VehicleType;
    bodyType: null;
    vehicleId: string;
    lat: number;
    lng: number;
    status: string;
    licensePlate: string;
  }[];
  selectedMapVehicle: any;
}

export interface VehicleType {
  name: string;
  id: string;
  grossWeight: number;
}


const VehiclesMap = (props: MapProps) => {
  const { containerHeight, data, selectedMapVehicle } = props;
  const mapRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [wsUrl, setWsUrl] = useState('');

  const [defaultLayers, setDefaultLayers] = useState<any>(null);
  const [mapEl, setMapEl] = useState<any>(null);
  const [mapUi, setMapUi] = useState<any>(null);
  const [group, setGroup] = useState<any>(null);
  const [positions, setPositions] = useState([]);
  const [localData, setLocalData] = useState(data);
  const [selectedVehicle, setSelectedVehicle] = useState(selectedMapVehicle);
  const { showSnackBar } = useSnackBar();
  const [selectedVehicleData, setSelectedVehicleData] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleGetWsUrl = async () => {
    try {
      const { data } = await api.get(apiv1 + "websocket-connection/");
      setWsUrl(data.url);
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentVehiclePosition = async (vehicleId: string) => {
    if (vehicleId) {
      try {
        const { data } = await api.get(`${apiv1}location/vehicle/${vehicleId}`);
        setSelectedVehicleData(data);
      }
      catch (error) {
        console.log(error);
        setSelectedVehicleData(null);
      }
    }
  };

  const mapStart = async () => {
    const platform = new H.service.Platform({
      apikey: process.env.REACT_APP_HERE_MAPS as string,
    });

    setDefaultLayers(platform.createDefaultLayers());
    setMapEl(new H.Map(
      mapRef?.current,
      platform.createDefaultLayers().vector?.normal?.map,
      {
        pixelRatio: window.devicePixelRatio,
        center: (localData.length > 0 ? { lat: localData?.[0]?.lat, lng: localData?.[0]?.lng } : { lat: 0, lng: 0 }),
        zoom: 3
      },
    ));

    setGroup(new H.map.Group());
  };

  const renderBubbleContent = (marker: any) => {
    return (
      <div>
        <Typography>
          {marker.vehicleType.name} - {marker.licensePlate}
        </Typography>
        <Typography>
          {marker.status}
        </Typography>
      </div>
    )
  }

  const addMarkersToMap = () => {
    if (mapEl) {
      mapEl.removeObjects(mapEl.getObjects());
      localData.map((item: any) => {
        const marker = new H.map.Marker({ lat: item.lat, lng: item.lng }, { icon: new H.map.Icon(markIcon, { size: { w: 44, h: 44 } }), data: { vehicleId: item.vehicleId, content: '' }, zIndex: 888 });

        return mapEl.addObject(marker);
      })
    }
  };

  const setInteractiveMap = (mapUiLocal: any) => {
    // get the vector provider from the base layer
    const provider = mapEl.getBaseLayer().getProvider();

    // get the style object for the base layer
    const style = provider.getStyle();

    var changeListener = (evt: any) => {
      style.removeEventListener('change', changeListener);

      // enable interactions for the desired map features
      style.setInteractive(['places', 'places.populated-places'], true);

      // add an event listener that is responsible for catching the
      // 'tap' event on the feature and showing the infobubble
      mapEl.addEventListener('tap', (evt: any) => {
        console.log(evt, 'ovde ontap');
        // calculate infobubble position from the cursor screen coordinates
        let position = mapEl.screenToGeo(
          evt.currentPointer.viewportX,
          evt.currentPointer.viewportY
        );

        if (evt.target instanceof H.map.Marker) {
          getCurrentVehiclePosition(evt.target.getData().vehicleId);
          // const contentString = '';
          // const bubble = new H.ui.InfoBubble(position, {
          //   content: contentString
          // });
          // mapUiLocal.addBubble(bubble);
          // console.log(mapUiLocal)
          // bubble.open();
          mapEl.setCenter(position, true);
          setOpen(true);
        }
      }, false);
    };
    style.addEventListener('change', changeListener);
  };

  useEffect(() => {
    if (mapRef) {
      mapStart();
    }

    return () => {
      if (mapRef && mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    }
  }, []);

  useEffect(() => {
    if (wsUrl && mapEl) {
      const ws = new WebSocket(wsUrl);
      ws.onopen = () => console.log('WebSocket connection opened.');

      ws.onmessage = e => {
        const message = JSON.parse(e.data);
        const { ty, vId, lat, lng, tx } = message;
        console.log(message)
        if (ty === 'VEHICLE_UPDATE_LOCATION') {
          const mapMarkers = mapEl.getObjects();
          const markerFilter = mapMarkers.filter((marker: any) => marker.getData().vehicleId === vId);
          if (markerFilter.length > 0) {
            markerFilter[0].setGeometry({ lat: lat, lng: lng });
          };
        }
        if (ty === 'ACCEPTED_CARGO') {
          showSnackBar(tx, 'success');
        }
      };
      ws.onclose = () => console.log('WebSocket connection closed.');

      return () => {
        ws.close();
      }
    }
  }, [mapEl, wsUrl]);

  useEffect(() => {
    handleGetWsUrl();
    if (selectedMapVehicle) {
      getCurrentVehiclePosition(selectedMapVehicle.id);
    }
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      if (selectedVehicleData) {
        setLocalData([selectedVehicleData]);
      } else {
        setLocalData([]);
      }
    }
    
  }, [selectedVehicleData]);

  useEffect(() => {
    if (mapEl){
      addMarkersToMap();
    }
  }, [localData])


  useEffect(() => {
    if (mapEl) {
      new H.mapevents.Behavior(new H.mapevents.MapEvents(mapEl));
      const mapUiLocal = H.ui.UI.createDefault(mapEl, defaultLayers);
      setMapUi(mapUiLocal);
      addMarkersToMap();
      setInteractiveMap(mapUiLocal);
    };

    // return () => {
    //   setMapEl(null);
    // }
  }, [mapEl]);


  const reset = () => {
    setSelectedVehicle(null);
    setLocalData(data);
  };

  return (
    <Box sx={{ width: '100%', height: containerHeight, position: 'relative' }}>
      <Button
        sx={{ py: "10px", ml: "15px", zIndex: 999, position: 'absolute', top: '20px', right: '20px' }}
        onClick={() => reset()}
        variant={"contained"}
      >
        Prikazi sva vozila na mapi
      </Button>
      <div style={{ width: '100%', height: '100%', position: 'relative' }} ref={mapRef} >

      </div>
      {
        open && <VehicleInfo open={open} setOpen={setOpen} selectedVehicleData={selectedVehicleData} />
      }
    </Box>
  );
};


export default VehiclesMap;