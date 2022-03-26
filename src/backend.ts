import * as vscode from 'vscode';
import * as http from 'http';
import { RequestOptions } from 'https';

export function getStatus(callback: StatusSink) {

    console.log('getStatus() IN');
    let backendURL = vscode.workspace.getConfiguration('khub').get<string>('backendUrl');

    let opts: RequestOptions = {
        'method': 'GET',        
        'host': backendURL,
        //'host': 'www.google.fr',
        'path': '/status',
        'headers': {
        }
    };

    console.log('options hostname = ' + opts.host);
    
    var req = http.request(opts, function (res) {
        
        let chunks = '';    
        res.on("data", function (chunk) {            
            chunks += chunk;
        });
        res.on("end", function () {
            //console.log('server response is ' + chunks);

            let statusResult = JSON.parse(chunks);
            callback.display(statusResult);
        });        
        res.on("error", function (error) {  

            console.log('unexpected error: ' + res); 
            vscode.window.showErrorMessage('kfront:' + res);     
        });
        
    });
    
    req.on('error', function(res) { 
        console.log('unexpected error: ' + res); 
        vscode.window.showErrorMessage('kfront:' + res); 
    });

    req.end(); 

    
    console.log('getStatus() OUT');
}