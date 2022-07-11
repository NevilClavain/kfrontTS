
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

    private static _aliveStatus: string = 'ALIVE';


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
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getTreeItem : ' + element.getNodeId());
		return element;		
	}

	public getChildren(element?: StatusNode): Thenable<StatusNode[]> {

        
        //console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren');
/*
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
            
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren with id ' + element.getNodeId());

            let statusNodesArray: StatusNode[] = [];

            for(var i = 0; i < this._statusResult.length; i++) {

                let hostId: string = this._statusResult[i].hostId;

                if(hostId === element.getNodeId()) {

                    //console.log('>>>>> FOUND');

                    for(var j = 0; j < this._statusResult[i].helmChartsContent.length; j++) {

                        console.log('   **-> ' + this._statusResult[i].helmChartsContent[j].id);

                        

                    }
                }
            }


            return Promise.resolve(statusNodesArray);

            //return Promise.resolve([]);

        } else {

            console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren root');

            //console.log('obj length is **-> ' + this._statusResult.length );
            let statusNodesArray: StatusNode[] = [];
            
            for(var i = 0; i < this._statusResult.length; i++) {

                let hostId: string = this._statusResult[i].hostId;
                let statusValue: string = this._statusResult[i].status.value;
                let statusValueReason: string = this._statusResult[i].status.reason;

                let rootLabel: string = "";

                if(statusValue === StatusTreeDataProvider._aliveStatus) {
                    rootLabel = hostId + " - " + statusValue;
                } else {
                    rootLabel = hostId + " - " + statusValue + " (" + statusValueReason + ")";
                }
                
                const remoteNode = new StatusNode(hostId, rootLabel, vscode.TreeItemCollapsibleState.Collapsed);
                statusNodesArray.push(remoteNode);
            }
            
            return Promise.resolve(statusNodesArray);
        }   
          
	}    
}

class StatusNode extends vscode.TreeItem {

    private _nodeId: string;

    constructor( public readonly nodeId: string,
                 public readonly label: string,
                 public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
                     
            super(label, collapsibleState);
            this._nodeId = nodeId;
    }

    public getNodeId() {
        return this._nodeId;
    }
}