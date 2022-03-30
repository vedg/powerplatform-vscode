import axios from "axios";
import { integer } from "vscode-languageclient";
'use strict';

export function getHeader(accessToken: string) {
    return {
        authorization: "Bearer " + accessToken,
        'content-type': "application/json; charset=utf-8",
        accept: "application/json",
        'OData-MaxVersion': "4.0",
        'OData-Version': "4.0",
    };
}

export function getHeaderPaginated(accessToken: string, ps : string) {
    return {
        authorization: "Bearer " + accessToken,
        'content-type': "application/json; charset=utf-8",
        accept: "application/json",
        'OData-MaxVersion': "4.0",
        'OData-Version': "4.0",
        'Prefer': 'odata.maxpagesize=${ps}',
    };
}


export function getWebpageRequestUrl(method: string, dataverseOrg: string, api: string, data: string, version: string, entity: string, entityId: string, adx_websiteid: string)
{
    let requestUrl = '';
    switch (method) {
        case 'GET':
            if (entity === 'adx_webpages') {
                requestUrl = `https://${dataverseOrg}/${api}/${data}/${version}/${entity}?$filter=${_adx_websiteid_value} eq '7c14b4e4-0d8b-ec11-b3fe-00224829de6c'&$select=adx_name`;
            }
            else if (entity === 'adx_webtemplates') {
                requestUrl = `https://${dataverseOrg}/${api}/${data}/${version}/${entity}(${entityId})?$select=adx_name,adx_source`;
            }
            break;
        case 'PATCH':
            requestUrl = `https://${dataverseOrg}/${api}/${data}/${version}/${entity}(${entityId})`;
            break;

        default:
            break;
    }
    return requestUrl;
}
export function getRequestUrl(method: string, dataverseOrg: string, api: string, data: string, version: string, entity: string, entityId: string): string {
    let requestUrl = '';
    switch (method) {
        case 'GET':
            if (entity === 'adx_webpages') {
                requestUrl = `https://${dataverseOrg}/${api}/data/${version}/${entity}?$select=adx_name,adx_copy,adx_customcss,adx_customjavascript`;
            }
            else if (entity === 'adx_webtemplates') {
                requestUrl = `https://${dataverseOrg}/${api}/${data}/${version}/${entity}(${entityId})?$select=adx_name,adx_source`;
            }
            break;
        case 'PATCH':
            requestUrl = `https://${dataverseOrg}/${api}/${data}/${version}/${entity}(${entityId})`;
            break;

        default:
            break;
    }
    return requestUrl;
}

export function getRequestUrlwithFilter(method: string, dataverseOrg: string, api: string, data: string, version: string, entity: string, entityId: string, filter: string): string {
    let requestUrl = '';
    switch (method) {
        case 'GET':
            if (entity === 'adx_webpages') {
                requestUrl = `https://${dataverseOrg}/${api}/${data}/${version}/${entity}(${entityId})?$select=adx_name,adx_copy,adx_customcss,adx_customjavascript&${filter}`;
            }
            else if (entity === 'adx_webtemplates') {
                requestUrl = `https://${dataverseOrg}/${api}/${data}/${version}/${entity}(${entityId})?$select=adx_name,adx_source&${filter}`;
            }
            break;
        default:
            break;
    }
    return requestUrl;
}

export function getRequestUrlPaginated(method: string, dataverseOrg: string, api: string, data: string, version: string, entity: string, entityId: string, filter: string): string {
    let requestUrl = '';
    switch (method) {
        case 'GET':
            if (entity === 'adx_webpages') {
                requestUrl = `https://${dataverseOrg}/${api}/${data}/${version}/${entity}(${entityId})?$select=adx_name,adx_copy,adx_customcss,adx_customjavascript&${filter}`;
            }
            else if (entity === 'adx_webtemplates') {
                requestUrl = `https://${dataverseOrg}/${api}/${data}/${version}/${entity}(${entityId})?$select=adx_name,adx_source&${filter}`;
            }
            break;
        default:
            break;
    }
    return requestUrl;
}
export default axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
      "Content-type": "application/json"
    }
  });
