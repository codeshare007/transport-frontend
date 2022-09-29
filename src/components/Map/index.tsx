import React, { useEffect, useRef, useState } from 'react';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import MarkerIcon from '../../assets/icons/marker.svg';
import H from "@here/maps-api-for-javascript";

interface MapProps {
  containerHeight: string;
  data?: any;
}

const HereMap = (props: MapProps) => {
  const { containerHeight, data } = props;
  const mapRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    if (mapRef && data && data.origin && data.destination && data.goodsDetails.weight) {
      const platform = new H.service.Platform({
        apikey: process.env.REACT_APP_HERE_MAPS as string,
      });

      const defaultLayers = platform.createDefaultLayers();

      const map: any = new H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          center: { lat: 0, lng: 0 },
        },
      );

      const routingParams = {
        'transportMode': 'truck',
        'spans': ['truckAttributes'],
        'vehicle[grossWeight]': data?.transportDetails?.vehicleType?.grossWeight || 0,
        'origin': `${data?.origin?.location?.lat},${data?.origin?.location?.lng}`,
        'destination': `${data?.destination?.location?.lat},${data?.destination?.location?.lng}`,
        'return': 'polyline',
      }



      const setInteractive = (map: any) => {
        // get the vector provider from the base layer
        var provider = map.getBaseLayer().getProvider();

        // get the style object for the base layer
        var style = provider.getStyle();

        var changeListener = (evt: any) => {
          if (style.getState() === H.map.Style.State.READY) {
            style.removeEventListener('change', changeListener);

            // enable interactions for the desired map features
            style.setInteractive(['places', 'places.populated-places'], true);

            // add an event listener that is responsible for catching the
            // 'tap' event on the feature and showing the infobubble
            provider.addEventListener('tap', onTap);
          }
        };
        style.addEventListener('change', changeListener);
      };

      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      const ui = H.ui.UI.createDefault(map, defaultLayers);
      let bubble: any;


      const onTap = (evt: any) => {
        // calculate infobubble position from the cursor screen coordinates
        let position = map.screenToGeo(
          evt.currentPointer.viewportX,
          evt.currentPointer.viewportY
        );
        // read the properties associated with the map feature that triggered the event
        let props = evt.target.getData().properties;

        // create a content for the infobubble
        let content = '<div style="width:100%">It is a ' + props.kind + ' ' + (props.kind_detail || '') +
          (props.population ? '<br /> population: ' + props.population : '') +
          '<br /> local name is ' + props['name'] +
          (props['name:ar'] ? '<br /> name in Arabic is ' + props['name:ar'] : '') + '</div>';

        // Create a bubble, if not created yet
        if (!bubble) {
          bubble = new H.ui.InfoBubble(position, {
            content: content
          });
          ui.addBubble(bubble);
        } else {
          // Reuse existing bubble object
          bubble.setPosition(position);
          bubble.setContent(content);
          bubble.open();
        }
      };

      const onResult = (result: any) => {
        // ensure that at least one route was found
        if (result.routes.length) {
          result.routes[0].sections.forEach((section: any) => {
            // Create a linestring to use as a point source for the route line
            let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

            // Create a polyline to display the route:
            let routeLine = new H.map.Polyline(linestring, {
              data: {
                type: 'routeLine',
              },
              style: { strokeColor: '#36CB83', lineWidth: 4 }
            });

            // Create a marker for the start point:
            let startMarker = new H.map.Marker(section.departure.place.location, {
              data: {
                type: 'startMarker',
              },
              icon: new H.map.Icon(MarkerIcon),
            });

            // Create a marker for the end point:
            let endMarker = new H.map.Marker(section.arrival.place.location, {
              data: {
                type: 'endMarker',
              },
              icon: new H.map.Icon(MarkerIcon),
            });

            // Add the route polyline and the two markers to the map:
            map.addObjects([routeLine, startMarker, endMarker]);

            // Set the map's viewport to make the whole route visible:
            map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox(), zoom: 7 });
          });
        }
      };

      const router = platform.getRoutingService(undefined, 8);

      router.calculateRoute(routingParams, onResult,
        function (error) {
          alert(error.message);
        });
      setInteractive(map);
    }

    return () => {
      if (mapRef && mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    }
  }, [data]);


  return (
    <div
      style={{ width: '100%', height: containerHeight, position: 'relative' }} ref={mapRef} />
  );
};


export default HereMap;