
import { TreeStatusView } from './treeStatusView';

export class TreeStatusSink implements StatusSink {

    constructor() {        
    }
    
    display(statusResult: any): void {            
        TreeStatusView.getInstance().updateData(statusResult);
    }    
}

