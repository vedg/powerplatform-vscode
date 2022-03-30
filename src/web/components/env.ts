'use strict';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as vscode from 'vscode';

// function getHeader(accessToken: string) {
//     return {
//         authorization: "Bearer " + accessToken,
//         'content-type': "application/json; charset=utf-8",
//         accept: "application/json",
//         'OData-MaxVersion': "4.0",
//         'OData-Version': "4.0",
//     };
// }

// function getRequestUrl(method: string, dataverseOrg: string, api: string, data: string, version: string, entity: string, entityId: string): string {
//     let requestUrl = '';
//     switch (method) {
//         case 'GET':
//             // TODO: move these checks to a common function
//             if (entity === 'adx_webpages') {
//                 requestUrl = `https://${dataverseOrg}/${api}/${data}/${version}/${entity}(${entityId})?$select=adx_name,adx_copy,adx_customcss,adx_customjavascript`;
//             }
//             else if (entity === 'adx_webtemplates') {
//                 requestUrl = `https://${dataverseOrg}/${api}/${data}/${version}/${entity}(${entityId})?$select=adx_name,adx_source`;
//             }
//             break;
//         case 'PATCH':
//             requestUrl = `https://${dataverseOrg}/${api}/${data}/${version}/${entity}(${entityId})`;
//             break;

//         default:
//             break;
//     }
//     return requestUrl;
// }
