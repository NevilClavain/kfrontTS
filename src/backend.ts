import * as vscode from 'vscode';
import * as http from 'http';
import { RequestOptions } from 'https';

export function deploy(host: string, app:string, mode:string) {
    
    console.log('deploy() IN');

    let backendURL = vscode.workspace.getConfiguration('khub').get<string>('backendUrl');
    let backendPort = vscode.workspace.getConfiguration('khub').get<string>('backendPort');
    let endPoint = vscode.workspace.getConfiguration('khub').get<string>('endPoint');

    let opts: RequestOptions = {
        'method': 'PUT',        
        'host': backendURL,
        'port':backendPort,        
        'path': endPoint + '/' + host + '?operation=install&comp=' + app + '&category=' + mode,
        'headers': {
            'accept': '*/*',
            'host': backendURL + ':' + backendPort
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
            vscode.window.showInformationMessage(requestDescr + " returned " + res.statusCode);
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

    console.log('deploy() OUT');
}

export function remove(host: string, app:string) {
    
    console.log('remove() IN');

    let backendURL = vscode.workspace.getConfiguration('khub').get<string>('backendUrl');
    let backendPort = vscode.workspace.getConfiguration('khub').get<string>('backendPort');
    let endPoint = vscode.workspace.getConfiguration('khub').get<string>('endPoint');

    let opts: RequestOptions = {
        'method': 'PUT',        
        'host': backendURL,
        'port':backendPort,        
        'path': endPoint + '/' + host + '?operation=uninstall&comp=' + app,
        'headers': {
            'accept': '*/*',
            'host': backendURL + ':' + backendPort
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
            vscode.window.showInformationMessage(requestDescr + " returned " + res.statusCode);
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

    console.log('remove() OUT');
}

export function getStatus(callback: StatusSink) {

    console.log('getStatus() IN');

    let backendURL = vscode.workspace.getConfiguration('khub').get<string>('backendUrl');
    let backendPort = vscode.workspace.getConfiguration('khub').get<string>('backendPort');
    let endPoint = vscode.workspace.getConfiguration('khub').get<string>('endPoint');

    let opts: RequestOptions = {
        'method': 'GET',        
        'host': backendURL,
        'port':backendPort,
        //'host': 'www.google.fr',
        'path': endPoint,
        'headers': {
            'accept': '*/*',
            'host': backendURL + ':' + backendPort
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
            vscode.window.showInformationMessage(requestDescr + " returned " + res.statusCode);

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