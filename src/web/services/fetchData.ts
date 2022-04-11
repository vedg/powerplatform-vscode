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
            vscode.window.showInformationMessage("auth failed");
            throw new Error(req.statusText);
        }
        vscode.window.showInformationMessage("I am in fetchData, auth successful");
        const res = await req.json();
        console.log(res);

        vscode.window.showInformationMessage(JSON.stringify(res))
        if (res) {
            fileName = res['adx_name'] ? res['adx_name'] : '';
            vscode.window.showInformationMessage("creating file with name ")
            vscode.window.showInformationMessage(fileName)
            vscode.window.showInformationMessage(JSON.stringify(res))

            for(let counter = 0; counter<24; counter++){
                console.log("for loop executed : " + counter)
                vscode.window.showInformationMessage("" + counter)
                vscode.window.showInformationMessage("" + res.value[counter].adx_name)
                adxCopy = res.value[counter].adx_copy ? res.value[counter].adx_copy  : 'dummy copy';
                adxCustomJavascript = res.value[counter].adx_customjavascript ? res.value[counter].adx_customjavascript : 'dummy js';
                adxCustomCss = res.value[counter].adx_customcss ? res.value[counter].adx_customcss : 'dummy css';
                adxSource = res.value[counter].adx_source ? res.value[counter].adx_source : 'dummy source';
                console.log(adxCustomCss)

                const myString = adxCustomCss;
                //var stringToArray = myString.split(',');
                const stringToIntArray = Uint8Array.from(Array.from(myString).map(letter => letter.charCodeAt(0)));
                const js = adxCustomJavascript;
                //var stringToArray = myString.split(',');
                const jsstringToIntArray = Uint8Array.from(Array.from(js).map(letter => letter.charCodeAt(0)));
                const html = adxSource;
                //var stringToArray = myString.split(',');
                const htmlstringToIntArray = Uint8Array.from(Array.from(html).map(letter => letter.charCodeAt(0)));
                console.log(stringToIntArray);
                console.log(jsstringToIntArray);
                console.log(htmlstringToIntArray);
               // portalsFS.createDirectory(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}:/'web-templates'/`, true));
                //portalsFS.createDirectory(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/'web-templates':/${res.value[counter].adx_name}/`, true));
               portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${res.value[counter].adx_name}.css`), stringToIntArray, { create: true, overwrite: true });
               portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${res.value[counter].adx_name}.js`), jsstringToIntArray, { create: true, overwrite: true });
               portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${res.value[counter].adx_name}.html`), htmlstringToIntArray, { create: true, overwrite: true });
                    ///${res.value[counter].adx_name}
               // portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${res.value[counter].adx_name}.css`), new TextEncoder().encode('test'), { create: true, overwrite: true });
                //portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${res.value[counter].adx_name}.js`), new TextEncoder().encode(adxCustomJavascript), { create: true, overwrite: true });
                //portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${res.value[counter].adx_name}.html`), new TextEncoder().encode(adxCopy), { create: true, overwrite: true });
                console.log("name value executed : " + res.value[counter].adx_name)
                vscode.window.showInformationMessage("checking name" +res.value[counter].adx_name)
            }
        }
        if (entity === 'adx_webpages') {
            //portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${fileName}.css`), new TextEncoder().encode(adxCustomCss), { create: true, overwrite: true });
            //portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${fileName}.js`), new TextEncoder().encode(adxCustomJavascript), { create: true, overwrite: true });
           // portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${fileName}.html`), new TextEncoder().encode(adxCopy), { create: true, overwrite: true });
        } else if (entity === 'adx_webtemplates') {
            //portalsFS.writeFile(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/${fileName}.html`), new TextEncoder().encode(adxSource), { create: true, overwrite: true });
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
