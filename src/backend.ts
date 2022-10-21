import * as vscode from 'vscode';
import * as http from 'http';
import { RequestOptions } from 'https';

export function getStatus(callback: StatusSink) {

    console.log('getStatus() IN');
    let backendURL = vscode.workspace.getConfiguration('khub').get<string>('backendUrl');

    let opts: RequestOptions = {
        'method': 'GET',        
        'host': backendURL,
        'port':9080,
        //'host': 'www.google.fr',
        'path': '/v1/khub/content',
        'headers': {
        }
    };

    let requestDescr : String = opts.method + " " + opts.path;

    console.log('options hostname = ' + opts.host);
    
    var req = http.request(opts, function (res) {
        
        let chunks = '';    
        res.on("data", function (chunk) {            
            chunks += chunk;
        });
        res.on("end", function () {
            
            //vscode.window.showInformationMessage("get status request SUCCESS");

            
            vscode.window.showInformationMessage(requestDescr + " SUCCESSFUL");

            let statusResult = JSON.parse(chunks);
            callback.display(statusResult);
        });        
        res.on("error", function (error) {

            console.log('unexpected error: ' + res);
            vscode.window.showErrorMessage(requestDescr + " FAILURE : " + error);    
        });
        
    });
    
    req.on('error', function(res) { 
        console.log('unexpected error: ' + res); 
        vscode.window.showErrorMessage('kfront:' + res); 
    });

    req.end(); 

    
    console.log('getStatus() OUT');
}