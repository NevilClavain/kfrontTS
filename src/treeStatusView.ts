
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

    private _statusResult:   any;

    private static _aliveStatus: string = 'ALIVE';


    private _onDidChangeTreeData: vscode.EventEmitter<StatusNode | undefined | null | void> = new vscode.EventEmitter<StatusNode | undefined | null | void>();

    readonly onDidChangeTreeData: vscode.Event<void | StatusNode | null | undefined> = this._onDidChangeTreeData.event;

    constructor() {
    }

    public updateData(statusResult: any) {        
        
        this._statusResult = statusResult;

        /*
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> updateData');

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
        //console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getTreeItem : ' + element.getNodeId());
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
            //console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren with id ' + element.getHostId());

            if(element.getNodeType() === NodeType.host) {

                let statusNodesArray: StatusNode[] = [];
                let hosts = this._statusResult.hosts;

                for(var i = 0; i < hosts.length; i++) {
    
                    let hostId: string = hosts[i].hostId;
                    
                    if(hostId === element.getHostId()) {
                        for(var j = 0; j < hosts[i].helmChartsContent.length; j++) {
        
                            let deploymentId: string = hosts[i].helmChartsContent[j].id;
                            
                            const remoteNode = new StatusNode(hostId, deploymentId, "", deploymentId, NodeType.helmChart, vscode.TreeItemCollapsibleState.Collapsed);
                            remoteNode.contextValue = "helmChart";

                            statusNodesArray.push(remoteNode);
                        }
                    }
                }
                return Promise.resolve(statusNodesArray);
            }
            else if(element.getNodeType() === NodeType.helmChart) {

                let statusNodesArray: StatusNode[] = [];
                let hosts = this._statusResult.hosts;

                for(var i = 0; i < hosts.length; i++) {
    
                    let hostId: string = hosts[i].hostId;

                    if(hostId === element.getHostId()) {
                        for(var j = 0; j < hosts[i].helmChartsContent.length; j++) {
    
                            //console.log('   **-> ' + hosts[i].helmChartsContent[j].id);
    
                            let deploymentId: string = hosts[i].helmChartsContent[j].id;

                            if(deploymentId === element.getHelmChartId()) {

                                for(var k = 0; k < hosts[i].helmChartsContent[j].informations.length; k++) {
                                  
                                    let informations: string = hosts[i].helmChartsContent[j].informations[k];

                                    if(informations[0] !== '\n') { // dont keep '\n only' lines
                                        const remoteNode = new StatusNode(hostId, deploymentId, "", informations, NodeType.helmChartInformations, vscode.TreeItemCollapsibleState.None);
                                        remoteNode.contextValue = "helmChartInformations";

                                        statusNodesArray.push(remoteNode);    
                                    }
                                }
                            }                            
                        }
                    }
                }
                return Promise.resolve(statusNodesArray);                
            }
            else {
                return Promise.resolve([]);
            }

        } else {

            //console.log('>>>>>>>>>>>>>>>>>>>>>>>>> getChildren root');
            
            let statusNodesArray: StatusNode[] = [];

            // collect hosts
            let hosts = this._statusResult.hosts;
            for(var i = 0; i < hosts.length; i++) {

                let hostId: string = hosts[i].hostId;
                let statusValue: string = hosts[i].status.value;
                let statusValueReason: string = hosts[i].status.reason;

                let rootLabel: string = "";

                if(statusValue === StatusTreeDataProvider._aliveStatus) {
                    rootLabel = "Host : " + hostId + " - " + statusValue;
                } else {
                    rootLabel = "Host : " + hostId + " - " + statusValue + " (" + statusValueReason + ")";
                }
                
                const remoteNode = new StatusNode(hostId, "", "", rootLabel, NodeType.host, vscode.TreeItemCollapsibleState.Collapsed);
                remoteNode.contextValue = "host";

                statusNodesArray.push(remoteNode);
            }

            // collect possible deployments
            let deployments = this._statusResult.deployments;
            for(var i = 0; i < deployments.length; i++) {

                let alias: string = deployments[i].alias;
                const deployment = new StatusNode("", "", alias, "Deployment :" + alias, NodeType.deployment, vscode.TreeItemCollapsibleState.None);

                deployment.contextValue = "deployment";

                statusNodesArray.push(deployment);
            }

            
            return Promise.resolve(statusNodesArray);
        }   
          
	}    
}

enum NodeType {
    host,
    deployment,
    helmChart, 
    helmChartInformations
}

export class StatusNode extends vscode.TreeItem {

    private _nodeType :         NodeType;
    private _hostId:            string;
    private _helmChartId:       string;
    private _deploymentAlias:   string;
    
    constructor( public readonly hostId: string,
                 public readonly helmChartId: string,
                 public readonly deploymentAlias: string,
                 public readonly label: string,
                 public readonly type: NodeType,
                 public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
                     
            super(label, collapsibleState);
            this._hostId = hostId;
            this._helmChartId = helmChartId;
            this._deploymentAlias = deploymentAlias;
            this._nodeType = type;
    }

    public getHostId() {
        return this._hostId;
    }

    public getHelmChartId() {
        return this._helmChartId;
    }

    public getDeploymentAlias() {
        return this._deploymentAlias;
    }

    public getNodeType() {
        return this._nodeType;
    }
}