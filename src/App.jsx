import { CssBaseline, Grid } from '@material-ui/core'
import { useEffect, useState } from 'react';
import { getLocationData } from './api';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

function App() {
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('3');
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [locationData, setLocationData] = useState([]);
  const [coordinates, setCoordinates] = useState({
    lat: 0,
    lng: 0
  });
  const [bounds, setBounds] = useState(null);

  const [childClick, setChildClick] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autoC) => {
    setAutocomplete(autoC)
  }

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();
    setCoordinates({ lat, lng })
  }


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude });
    }, (err) => console.log(err), { timeout: 8000 });
  }, []);
  // rating
  useEffect(() => {
    const filtered = locationData.filter((place) => Number(place.rating) > rating);
    setFilteredPlaces(filtered);
  }, [rating]);
  // boundary
  useEffect(() => {
    if (bounds) {
      setLoading(true)
      getLocationData(type, bounds)
        .then((data) => {
          setLocationData(data.filter(place => place?.name && place?.num_reviews > 0));
          setFilteredPlaces([]);
          setLoading(false);
        })
    }
  }, [type, bounds]);

  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} onLoad={onLoad} onPlaceChanged={onPlaceChanged} />
      <Grid container spacing={3} style={{ width: '100%' }} >
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces : locationData}
            childClicked={childClick}
            isLoading={loading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            coordinates={coordinates}
            setBounds={setBounds}
            places={filteredPlaces.length ? filteredPlaces : locationData}
            setChildClick={setChildClick}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
