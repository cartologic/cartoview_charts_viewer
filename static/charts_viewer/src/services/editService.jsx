import {getCRSFToken,hasTrailingSlash} from '../helpers/helpers.jsx'
export default class EditService {
  constructor(urls) {
    this.baseUrl = urls.baseUrl
    this.maps = [];
  }
  save(instanceConfig, id) {
        console.log(id);
    const url = id
      ? this.baseUrl + "apps/charts_viewer/"+id+"/edit"
      : this.baseUrl + "apps/charts_viewer/new"
    return fetch(hasTrailingSlash(url) ? url : url+"/" , {
      method: 'POST',
      credentials: "same-origin",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        "X-CSRFToken": getCRSFToken()
      }),
      body: JSON.stringify(instanceConfig)
    }).then((response)=>response.json())
  }
}
