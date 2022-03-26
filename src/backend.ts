import * as vscode from 'vscode';

export function getStatus(callback: StatusSink) {

    console.log('getStatus() IN');
    let backendURL = vscode.workspace.getConfiguration('khub').get('backendUrl');

    var options = {
        'method': 'GET',        
        'hostname': backendURL,
        'path': '/status',
        'headers': {
        },
        'maxRedirects': 20
    };

    console.log('options hostname = ' + options.hostname);

    let statusResult = new Object();
    callback.display(statusResult);
    
    console.log('getStatus() OUT');
}