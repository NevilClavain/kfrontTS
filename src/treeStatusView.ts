
import * as vscode from 'vscode';

export class TreeStatusView {

	constructor(context: vscode.ExtensionContext) {
        console.log('TreeStatusView ctor');

        const treeDataProvider = new StatusTreeDataProvider();
        vscode.window.createTreeView('kfrontTreeView', { treeDataProvider });
    }

}

class StatusTreeDataProvider implements vscode.TreeDataProvider<StatusNode> {

	public getTreeItem(element: StatusNode): vscode.TreeItem {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getTreeItem');

		return element;		
	}

	public getChildren(element?: StatusNode): Thenable<StatusNode[]> {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren');

        const rootStatusNode = new StatusNode("root bloody root", vscode.TreeItemCollapsibleState.Expanded);
        const rootStatusNode2 = new StatusNode("plop!", vscode.TreeItemCollapsibleState.Expanded);

        if( element) {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren leafs');
            return Promise.resolve([]);
        } else {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren root');
            return Promise.resolve([rootStatusNode, rootStatusNode2]);
        }		
	}    
}

class StatusNode extends vscode.TreeItem {

    constructor( public readonly label: string,
                 public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
                     
            super(label, collapsibleState);
    }
}