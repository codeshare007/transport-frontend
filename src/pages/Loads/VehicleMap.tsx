import React, { useEffect, useRef, useState } from 'react';
import MarkerIcon from '../../assets/icons/marker.svg';
import H from "@here/maps-api-for-javascript";
import markActiveIcon from './icons/marker-active-truck.png';
import markInactiveIcon from './icons/marker-inactive-truck.png';
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
          center: { lat: data?.origin?.location?.lat, lng: data?.destination?.location?.lng },
        },
      );

      const router = platform.getRoutingService(undefined, 8);
      let sideRouteLine : any;
      let routingParams = {
        'transportMode': 'truck',
        'spans': ['truckAttributes'],
        'vehicle[grossWeight]': data?.transportDetails?.vehicleType?.grossWeight || 0,
        'origin': `${data?.origin?.location?.lat},${data?.origin?.location?.lng}`,
        'destination': `${data?.destination?.location?.lat},${data?.destination?.location?.lng}`,
        'routingMode': 'short',
        'exclude[countries]': 'HRV',
        'return': 'polyline',
      }

      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      const ui = H.ui.UI.createDefault(map, defaultLayers);

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
            map.addEventListener('tap', (evt: any) => {
              console.log(evt, 'ovde ontap');
              // calculate infobubble position from the cursor screen coordinates
              let position = map.screenToGeo(
                evt.currentPointer.viewportX,
                evt.currentPointer.viewportY
              );

              if (evt.target instanceof H.map.Marker || evt.target instanceof H.map.DomMarker) {
                const vehicleMarker = evt.target;
                const markerData = vehicleMarker.getData();

                // Draw polyline
                if (markerData.tours[markerData.tours.length - 1].status == 'HEADING_TO_LOADING_SITE' && markerData.status == 'IN_PROGRESS') {
                  routingParams.origin = '' + data.origin.location.lat + ',' + data.origin.location.lng;
                  routingParams.destination = '' + vehicleMarker.getGeometry().lat + ',' + vehicleMarker.getGeometry().lng;
                } else if (markerData.tours[markerData.tours.length - 1].status == 'HEADING_TO_UNLOADING_SITE' && markerData.status == 'IN_PROGRESS') {
                  routingParams.origin = '' + vehicleMarker.getGeometry().lat + ',' + vehicleMarker.getGeometry().lng;
                  routingParams.destination = '' + data.destination.location.lat + ',' + data.destination.location.lng;
                }
                router.calculateRoute(routingParams, onResult1, function (error) {
                  alert(error.message);
                });

                // Draw infobubble
                const markerContent = '<div>REG. BROJ : ' + markerData.vehicle.licencePlate + '</div>'
                  + '<div>VOZAC : ' + markerData.driver.name + '</div>'
                  + '<div>KOMPANIJA : ' + markerData.company.name + '</div>'
                  + '<div>STATUS : ' + markerData.tours[markerData.tours.length - 1].status + '</div>';
                const bubble = new H.ui.InfoBubble(position, {
                  content: markerContent,
                });
                ui?.getBubbles().forEach(bub => ui.removeBubble(bub));
                ui?.addBubble(bubble);
                bubble.open();

                bubble.addEventListener('statechange', function(e: any) {
                  if (e.target.getState() === H.ui.InfoBubble.State.CLOSED) {
                    if (sideRouteLine) {
                      map.removeObject(sideRouteLine);
                      sideRouteLine = null;
                    }
                  }
                });
              }
              map.setCenter(position, true);
            });  
          }
        };
        style.addEventListener('change', changeListener);
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

            data?.cargoOrders?.map((data: any) => {
              if (data.lastReportedLocation !== null) {
                const truckmarker = data.lastReportedLocation.minutesPassedSinceReported > 120 ? new H.map.Marker({ lat: data.lastReportedLocation.geolocation.lat, lng: data.lastReportedLocation.geolocation.lng }, { icon: new H.map.Icon(markInactiveIcon, { size: { w: 44, h: 44 } }), data: data, zIndex: 888 }) : new H.map.Marker({ lat: data.lastReportedLocation.geolocation.lat, lng: data.lastReportedLocation.geolocation.lng }, { icon: new H.map.Icon(markActiveIcon, { size: { w: 44, h: 44 } }), data: data, zIndex: 888 });

                return map.addObject(truckmarker);
              }
            })
            var bottomLeftLat = null, bottomLeftLng = null;
            var topRightLat = null, topRightLng = null;
            var percentageMargin = 50;

            bottomLeftLat = data?.origin?.location?.lat;
            topRightLat = data?.destination?.location?.lat;
            bottomLeftLng = data?.origin?.location?.lng;
            topRightLng = data?.destination?.location?.lng;

            var LatDifference = data?.origin?.location?.lat - data?.destination?.location?.lat;
            var LngDifference = data?.origin?.location?.lng - data?.destination?.location?.lng;
            topRightLat -= LatDifference * percentageMargin / 200; //Eg if percentage Margin is 10% this adds 5% to the right, because other 5% will go from the left.
            bottomLeftLat += LatDifference * percentageMargin / 200;
            topRightLng -= LngDifference * percentageMargin / 200;
            bottomLeftLng += LngDifference * percentageMargin / 200;

            var bottomLeftMarker = new H.map.Marker({ lat: bottomLeftLat, lng: bottomLeftLng });
            var topRightMarker = new H.map.Marker({ lat: topRightLat, lng: topRightLng });
            var viewPortGroup = new H.map.Group();
            viewPortGroup.addObjects([bottomLeftMarker, topRightMarker]);

            // Set the map's viewport to make the whole route visible:
            map.getViewModel().setLookAtData({ bounds: viewPortGroup.getBoundingBox() });

            console.log(viewPortGroup.getBoundingBox());
          });
        }
      };

      const onResult1 = (result: any) => {
        // ensure that at least one route was found
        if (result.routes.length) {
          result.routes[0].sections.forEach((section: any) => {
            // Create a linestring to use as a point source for the route line
            let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

            // Create a polyline to display the route:
            sideRouteLine = new H.map.Polyline(linestring, {
              data: {
                type: 'routeLine',
              },
              style: { strokeColor: '#300000', lineWidth: 4 }
            });
            
            // Add the route polyline and the two markers to the map:
            map.addObjects([sideRouteLine]);
          });
        }
      };

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