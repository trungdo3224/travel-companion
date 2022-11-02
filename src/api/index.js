import axios from "axios";

export const getLocationData = async (type,{ sw, ne }) => {
  const url = `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`;
  try {
    const response = await axios.get(url, {
      params: {
        bl_latitude: sw.lat,
        tr_latitude: ne.lat,
        bl_longitude: sw.lng,
        tr_longitude: ne.lng,
      },
      headers: {
        "X-RapidAPI-Key": "967bcc1d03msh1be34cdaece6e34p11ad75jsn2ebf41725d62",
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      },
    });

    const {
      data: { data },
    } = response;

    return data;
  } catch (error) {
    console.log(error);
  }
};
