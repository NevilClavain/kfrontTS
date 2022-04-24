
import * as vscode from 'vscode';

export class TreeStatusView {

    treeDataProvider: StatusTreeDataProvider;

	constructor(context: vscode.ExtensionContext) {
        console.log('TreeStatusView ctor');
        
        this.treeDataProvider = new StatusTreeDataProvider();
        const treeDataProvider = this.treeDataProvider;
        vscode.window.createTreeView('kfrontTreeView', { treeDataProvider });

    }

    public updateData() {
        this.treeDataProvider.updateData();
    }
}

class StatusTreeDataProvider implements vscode.TreeDataProvider<StatusNode> {

    refreshCounter: any;

    constructor() {
        this.refreshCounter = 0;
    }

    public updateData() {        
        this.refreshCounter++;
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> updateData : refreshCounter = ' + this.refreshCounter);
    }

	public getTreeItem(element: StatusNode): vscode.TreeItem {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getTreeItem');

		return element;		
	}

	public getChildren(element?: StatusNode): Thenable<StatusNode[]> {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren');

        const rootStatusNode = new StatusNode("root bloody root", vscode.TreeItemCollapsibleState.Expanded);
        const rootStatusNode2 = new StatusNode("m_refresh_counter = " + this.refreshCounter, vscode.TreeItemCollapsibleState.Expanded);

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