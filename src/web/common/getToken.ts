'use strict';
import * as vscode from 'vscode';

export async function getToken(accessToken: string) {
    const token = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        placeHolder: 'Portal/Dataverse access token',
        prompt: 'Enter a Portal/Dataverse access token.'
    });
    if (!token) {
        throw new Error('AccessToken is required');
    }
    accessToken = token;
    return accessToken;
}
