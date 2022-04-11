'use strict';

import * as vscode from 'vscode';
import { PortalsFS } from './fileSystemProvider';
import { getToken } from './common/getToken';
import { createFileSystem } from './common/createFileSystem';
import { fetchData } from './services/fetchData';

export const portalsFolderName = 'StarterPortal';
export const portalsUriScheme = 'portals';
const portalsWorkspaceName = 'Power Portals';
export const portalConfigScheme = '.portalconfig';
export const vscodeconfigScheme = '.vscodeconfig';


export function activate(context: vscode.ExtensionContext): void {

    console.log('Hello from - Portals WebExtension');

    const portalsFS = new PortalsFS();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider(portalsUriScheme, portalsFS, { isCaseSensitive: true }));
    let initialized = false;
    let accessToken = '';

    context.subscriptions.push(vscode.commands.registerCommand('portals.init', async (args: any) => {
        if (initialized) {
            return;
        }
        initialized = true;

        if (!args) {
            return;
        }

        const { dataverseOrg, api, data, version, entity, entityId } = args;

        vscode.window.showInformationMessage('editing '+ entity);

        // uncomment this after pre-authorization of VSCode firstPartyApp(aebc6443-996d-45c2-90f0-388ff96faa56) in Dataverse
        // try {
        //     const session = await vscode.authentication.getSession("microsoft", ["https://org2e2e9cae.crm.dynamics.com" + "/.default"], { createIfNone: true });
        //     console.log(session.accessToken);
        // }catch(e: any) {
        //     console.log(e.toString());
        // }

        // Prompt for the Access Token.
        accessToken = await getToken(accessToken);

        // some more files & folders
        vscode.window.showInformationMessage('creating portals folder');
        //TODO: update to the right folder structure
        createFileSystem(portalsFS);

        // Do something before delay
        vscode.window.showInformationMessage('fetching portal data...');

        let adxCopy = '';
        let adxCustomJavascript = '';
        let adxCustomCss = '';
        let adxSource = '';

        ({ adxCopy, adxCustomJavascript, adxCustomCss, adxSource } = await fetchData(dataverseOrg, api, data, version, entity, entityId, accessToken, adxCopy, adxCustomJavascript, adxCustomCss, adxSource, portalsFS));
    }));

    context.subscriptions.push(vscode.commands.registerCommand('portals.workspaceInit', async () => {
        vscode.window.showInformationMessage('creating PowerPortals workspace');
        vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0, null, { uri: vscode.Uri.parse(`${portalsUriScheme}:/`), name: portalsWorkspaceName });
    }));

    // this is just for testing...remove this once pre-authorization is completed.
    context.subscriptions.push(vscode.commands.registerCommand('portals.login', async () => {
        try {
            const session = await vscode.authentication.getSession("microsoft", ["https://org2e2e9cae.crm.dynamics.com" + "/.default"], { createIfNone: true });
            console.log(session.accessToken);
        } catch (e: any) {
            console.log(e.toString());
        }
    }));

    // this is used for dynamically updating access token. Remove this after pre-authorization work is complete.
    context.subscriptions.push(vscode.commands.registerCommand('portals.accessToken', async () => {
        // Prompt for the Access Token.
        const token = await vscode.window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: 'Portal/Dataverse access token',
            prompt: 'Enter a Portal/Dataverse access token.'
        });
        if (!token) {
            throw new Error('AccessToken is required');
        }
        accessToken = token;
    }));

    // context.subscriptions.push(vscode.commands.registerCommand('portals.ping',async () => {
    //     const pingMessage = await vscode.window.showInputBox({
    //         ignoreFocusOut: true,
    //         placeHolder: 'Enter Ping Message',
    //         prompt: 'Enter a Ping Message for Portal Studio'
    //     });
    //     messageProtocol?.postMessage(pingMessage);
    // }));

}


