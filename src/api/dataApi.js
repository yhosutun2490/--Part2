import axios from "axios"
async function dataApi () {
  let data = await axios.get(
    "http://59.127.3.132:8000/ "
  )
    .then(function (response) {
      return response.data;
    })
    .catch(function (err) {
      return err;
    });
  return data
}

export default dataApi