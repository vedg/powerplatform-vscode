'use strict';
import * as vscode from 'vscode';
import { PortalsFS } from '../fileSystemProvider';
import { portalsUriScheme, portalsFolderName } from '../extension';

export function createFileSystem(portalsFS: PortalsFS) {
    portalsFS.createDirectory(vscode.Uri.parse(`${portalsUriScheme}:/${portalsFolderName}/`, true));

}
