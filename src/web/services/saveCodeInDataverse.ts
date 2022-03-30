import * as vscode from 'vscode';
import { getHeader } from "../common/http-common";


export async function saveCodeInDataverse(accessToken: string, requestUrl: string, fileUri: vscode.Uri, entity: string, value: string) {
    let requestBody = '';

    const fileExtensionRX = /(?<extension>\.[0-9a-z]+$)/i;
    const fileExtensionMatch = fileExtensionRX.exec(fileUri.path);

    if (fileExtensionMatch?.groups === undefined) {
        return undefined;
    }

    const { extension } = fileExtensionMatch.groups;

    console.log(extension);

    switch (extension) {
        case '.html':
            if (entity === "adx_webpages") {
                requestBody = JSON.stringify({ "adx_copy": value });
            }
            else if (entity === "adx_webtemplates") {
                requestBody = JSON.stringify({ "adx_source": value });
            }
            break;
        case '.js':
            requestBody = JSON.stringify({ "adx_customjavascript": value });
            break;
        case '.css':
            requestBody = JSON.stringify({ "adx_customcss": value });
            break;
        default:
            break;
    }

    if (requestBody) {
        await fetch(requestUrl, {
            method: 'PATCH',
            headers: getHeader(accessToken),
            body: requestBody
        });
    }
}


