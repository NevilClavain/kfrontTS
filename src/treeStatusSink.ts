
export class TreeStatusSink implements StatusSink {

    constructor() {        
    }
    
    display(statusResult: Object): void {
        console.log('on status update with an Object! : ' + statusResult);
    }    
}

