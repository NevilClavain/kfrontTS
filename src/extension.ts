// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as backend from './backend';
import { TreeStatusSink } from './treeStatusSink';
import { StatusNode } from './treeStatusView';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	console.log('kfront extension activated');

	context.subscriptions.push(vscode.commands.registerCommand('kfront.refresh', refresh));
	context.subscriptions.push(vscode.commands.registerCommand('kfront.install_deployment', installDeployment));
	context.subscriptions.push(vscode.commands.registerCommand('kfront.uninstall_deployment', uninstallDeployment));

	refresh();
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('kfront extension Deactivated');
}


function refresh() {

	let refreshLog: string = 'kfront DISPLAY Refresh, khub url = ' + vscode.workspace.getConfiguration('khub').get('backendUrl');

	//vscode.window.showInformationMessage(refreshLog);
	console.log(refreshLog);

	let treeStatus = new TreeStatusSink();
	backend.getStatus(treeStatus);
}

function installDeployment(node: StatusNode) {

	let installLog: string = 'install deployment : ' + node.getDeploymentAlias() + ", " + node.getDeploymentType() + ' to ' + node.getHostId();	
	console.log(installLog);

	backend.deploy(node.getHostId(), node.getDeploymentAlias(), node.getDeploymentType());
}

function uninstallDeployment(node: StatusNode) {

	let uninstallLog: string = 'uninstall deployment : ' + node.getHelmChartId() + ' from ' + node.getHostId();	
	console.log(uninstallLog);

	backend.remove(node.getHostId(), node.getHelmChartId());
}

