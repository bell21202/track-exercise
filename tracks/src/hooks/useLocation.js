import {useState, useEffect} from 'react';
import { Accuracy, requestPermissionsAsync, watchPositionAsync} from 'expo-location';


// export our hook
export default (shouldTrack, callback) => {
    const [err, setErr] = useState(null);

    // empty array = only run once
    // this hook gets executed every time TrackCreateScreen re-renders
    useEffect(() => {
        let subscriber;
        const startWatching = async () => {
            try {
                let {status} = await requestPermissionsAsync();
                if(status !== 'granted') {
                    setErr({denied: 'true'});
                } else { 
                     // watch the users location
                    subscriber = await watchPositionAsync({
                        accuracy: Accuracy.BestForNavigation,
                        // which ever comes first
                        timeInterval: 1000, // once every second
                        distanceInterval: 10 // once every 10 meters
                        },  callback);
                }          
            }catch (e) {
                setErr(e);
            }
        };

        if (shouldTrack) {
            startWatching();
        } else {
            // stop watching
            if(subscriber) {
                subscriber.remove();
            } 
           subscriber = null;
        }

        // cleanup function gets called first 
        return () => {
            if(subscriber) {
                subscriber.remove();
            }
        };

    }, [shouldTrack, callback]);

    // hooks usually return arrays as convention
    return [err];


};