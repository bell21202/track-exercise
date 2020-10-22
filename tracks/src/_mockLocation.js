import * as Location from 'expo-location';

const tenMetersWithDegrees = 0.0001;

const getLocation = increment => {
    return {
        timestamp: 10000000,
        coords: {
            speed: 0,
            heading: 0,
            accurace: 5,
            altitudeAccuracy: 5,
            altitude: 5,
            longitude: -76.6120685 + increment * tenMetersWithDegrees,
            latitude: 39.2918961 + increment * tenMetersWithDegrees
        }
    };
};

let counter = 0;

// this runs once a second
setInterval(() =>{
    Location.EventEmitter.emit('Expo.locationChanged', {
       watchId: Location._getCurrentWatchId(),
       location: getLocation(counter) 
    })
    counter++;
}, 1000);