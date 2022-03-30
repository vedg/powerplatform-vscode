'use strict';
import * as vscode from 'vscode';
import { PortalsFS } from '../fileSystemProvider';
import { portalsUriScheme, portalsFolderName } from '../extension';
import { saveCodeInDataverse } from "./saveCodeInDataverse";
import { TextDecoder, TextEncoder } from 'util';
import { getRequestUrl, getHeader } from '../common/http-common';
//import { getHeader, getRequestUrl } from '../common/getHeader';

export async function fetchData(dataverseOrg: any, api: any, data: any, version: any, entity: any, entityId: any, accessToken: string, adxCopy: string, adxCustomJavascript: string, adxCustomCss: string, adxSource: string, portalsFS: PortalsFS) {
   let fileName = '';
    try {
        const requestUrl = getRequestUrl('GET', dataverseOrg, api, data, version, entity, entityId);
        vscode.window.showInformationMessage(requestUrl);
        const req = await fetch(requestUrl, {
            headers: getHeader(accessToken),
        });
        if (!req.ok) {
            throw new Error(req.statusText);
        }
        vscode.window.showInformationMessage("I am in fetchData");
        const res = await req.json();
        console.log(res);
        if (res) {
            fileName = res['adx_name'] ? res['adx_name'] : '';
            vscode.window.showInformationMessage("creating file with name ")
            vscode.window.showInformationMessage(fileName)
            adxCopy = res['adx_copy'] ? res['adx_copy'] : '';
            adxCustomJavascript = res['adx_customjavascript'] ? res['adx_customjavascript'] : '';
            adxCustomCss = res['adx_customcss'] ? res['adx_customcss'] : '';
            adxSource = res['adx_source'] ? res['adx_source'] : '';
        }
        if (entity === 'adx_webpages') {
            portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${fileName}.css`), new TextEncoder().encode(adxCustomCss), { create: true, overwrite: true });
            portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${fileName}.js`), new TextEncoder().encode(adxCustomJavascript), { create: true, overwrite: true });
            portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${fileName}.html`), new TextEncoder().encode(adxCopy), { create: true, overwrite: true });
        } else if (entity === 'adx_webtemplates') {
            portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${fileName}.html`), new TextEncoder().encode(adxSource), { create: true, overwrite: true });
        }

        vscode.workspace.onDidSaveTextDocument(async (e) => {
            vscode.window.showInformationMessage('saving file: ' + e.uri);
            const newFileData = portalsFS.readFile(e.uri);
            console.log(new TextDecoder().decode(newFileData));

            const patchRequestUrl = getRequestUrl('PATCH', dataverseOrg, api, data, version, entity, entityId);
            vscode.window.showInformationMessage(patchRequestUrl);
            await saveCodeInDataverse(accessToken, patchRequestUrl, e.uri, entity, new TextDecoder().decode(newFileData));
        });
    } catch (e: any) {
        if (e.message === 'Unauthorized') {
            vscode.window.showErrorMessage('Failed to authenticate');
        }
        throw e;
    }
    return { adxCopy, adxCustomJavascript, adxCustomCss, adxSource };
}
