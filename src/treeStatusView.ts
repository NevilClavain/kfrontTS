
import * as vscode from 'vscode';

export class TreeStatusView {

    private static instance: TreeStatusView;

    private treeDataProvider: StatusTreeDataProvider;

    private constructor() {

        console.log('TreeStatusView ctor');        
        this.treeDataProvider = new StatusTreeDataProvider();
        const treeDataProvider = this.treeDataProvider;
        vscode.window.createTreeView('kfrontTreeView', { treeDataProvider });
    }

    public static getInstance(): TreeStatusView {

        if(!TreeStatusView.instance) {
            TreeStatusView.instance = new TreeStatusView();
        }
        return TreeStatusView.instance;
    }

    public updateData(statusResult: any) {
        this.treeDataProvider.updateData(statusResult);
    }
}

class StatusTreeDataProvider implements vscode.TreeDataProvider<StatusNode> {

    private _refreshCounter: any;
    private _onDidChangeTreeData: vscode.EventEmitter<StatusNode | undefined | null | void> = new vscode.EventEmitter<StatusNode | undefined | null | void>();

    readonly onDidChangeTreeData: vscode.Event<void | StatusNode | null | undefined> = this._onDidChangeTreeData.event;

    constructor() {
        this._refreshCounter = 0;
    }

    public updateData(statusResult: any) {        
        this._refreshCounter++;
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> updateData : refreshCounter = ' + this._refreshCounter);

        console.log('obj length is *-> ' + statusResult.length );

        console.log('   *-> ' + statusResult[0].hostId);
        console.log('   *-> ' + statusResult[0].status.value);
        console.log('   *-> ' + statusResult[0].helmChartsContent[0].id);
        console.log('   *-> ' + statusResult[0].helmChartsContent[0].informations[0]);   

        
        // signal TreeView that StatusTreeDataProvider content was updated
        // so TreeView display will be updated :)
        this._onDidChangeTreeData.fire();
    }

	public getTreeItem(element: StatusNode): vscode.TreeItem {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getTreeItem : ' + element.label);    
		return element;		
	}

	public getChildren(element?: StatusNode): Thenable<StatusNode[]> {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren');

        const rootStatusNode = new StatusNode("root bloody root", vscode.TreeItemCollapsibleState.Expanded);
        const rootStatusNode2 = new StatusNode("m_refresh_counter = " + this._refreshCounter, vscode.TreeItemCollapsibleState.Expanded);

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