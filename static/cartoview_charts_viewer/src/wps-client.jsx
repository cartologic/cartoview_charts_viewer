import URLS from './URLS'
import { getCRSFToken } from './helpers/helpers.jsx'

const xmlTpls = {
    aggregate: require( './wps-xml/aggregate.xml'),
    aggregateWithFilters: require( './wps-xml/aggregateWithFilters.xml'),
    groupBy: require( './wps-xml/group-by.xml'),
    filters: require( './wps-xml/filters.xml')
}
class WpsClient {
    constructor(config) {
        this.config = config;
        this.urls=new URLS({proxy:PROXY_URL})
        this.url = this.urls.getProxiedURL(wpsURL)
        
    }
    aggregate(params){
        return fetch(this.url, {
          method: 'POST',
          body: this.getXml(xmlTpls.aggregate, params),
          credentials: 'include',
          headers: new Headers({
            'Content-Type': 'text/xml',
            "X-CSRFToken": getCRSFToken()
          }),
        }).then(response => response.json());
    }
    aggregateWithFilters(params){
        return fetch(this.url, {
          method: 'POST',
          credentials: "include",
          body: this.getXml(xmlTpls.aggregateWithFilters, params),
          headers: new Headers({
            'Content-Type': 'text/xml',
            "X-CSRFToken": getCRSFToken()
          }),
        }).then(response => response.json());
    }
    getXml(tpl, params){
        let output = tpl;
        Object.keys(params).map(key => {
            let val = xmlTpls[key] ? this.getXml(xmlTpls[key], params[key]) : params[key]
            output = output.replace("__" + key + "__", val);
        });
        //remove template vars that has no value
        output = output.replace(/_{2}\w+_{2}/g, "");
        return output.trim();
    }
}

export default WpsClient;
