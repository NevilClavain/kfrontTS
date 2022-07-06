
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
    private _statusResult:   any;


    private _onDidChangeTreeData: vscode.EventEmitter<StatusNode | undefined | null | void> = new vscode.EventEmitter<StatusNode | undefined | null | void>();

    readonly onDidChangeTreeData: vscode.Event<void | StatusNode | null | undefined> = this._onDidChangeTreeData.event;

    constructor() {
        this._refreshCounter = 0;
    }

    public updateData(statusResult: any) {        
        
        this._refreshCounter++;

        this._statusResult = statusResult;

        /*
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> updateData : refreshCounter = ' + this._refreshCounter);

        console.log('obj length is **-> ' + this._statusResult.length );

        console.log('   **-> ' + this._statusResult[0].hostId);
        console.log('   **-> ' + this._statusResult[0].status.value);
        console.log('   **-> ' + this._statusResult[0].helmChartsContent[0].id);
        console.log('   **-> ' + this._statusResult[0].helmChartsContent[0].informations[0]);
        */
        
        // signal TreeView that StatusTreeDataProvider content was updated
        // so TreeView display will be updated :)
        this._onDidChangeTreeData.fire();
    }

	public getTreeItem(element: StatusNode): vscode.TreeItem {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getTreeItem : ' + element.getHostId());
		return element;		
	}

	public getChildren(element?: StatusNode): Thenable<StatusNode[]> {

        /*
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren');

        const rootStatusNode = new StatusNode("id1", "root bloody root", vscode.TreeItemCollapsibleState.Expanded);
        const rootStatusNode2 = new StatusNode("id2", "m_refresh_counter = " + this._refreshCounter, vscode.TreeItemCollapsibleState.Expanded);

        if( element) {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren leafs');
            return Promise.resolve([]);
        } else {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren root');
            return Promise.resolve([rootStatusNode, rootStatusNode2]);
        }
        */

        if( element) {            
            return Promise.resolve([]);
        } else {

            //console.log('obj length is **-> ' + this._statusResult.length );
            let statusNodesArray: StatusNode[] = [];
            
            for(var i = 0; i < this._statusResult.length; i++) {

                const remoteNode = new StatusNode(this._statusResult[i].hostId, this._statusResult[i].hostId, vscode.TreeItemCollapsibleState.Expanded);
                statusNodesArray.push(remoteNode);
            }
            
            return Promise.resolve(statusNodesArray);
        }        
	}    
}

class StatusNode extends vscode.TreeItem {

    private _hostId: string;

    constructor( public readonly hostId: string,
                 public readonly label: string,
                 public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
                     
            super(label, collapsibleState);
            this._hostId = hostId;
    }

    public getHostId() {
        return this._hostId;
    }
}