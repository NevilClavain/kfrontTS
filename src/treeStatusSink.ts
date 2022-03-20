
export class TreeStatusSink implements StatusSink {

    constructor() {        
    }
    
    display(statusResult: string): void {
        console.log('on status update !');
    }    
}

