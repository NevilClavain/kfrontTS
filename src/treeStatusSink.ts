
export class TreeStatusSink implements StatusSink {

    constructor() {        
    }
    
    display(statusResult: any): void {
        

        console.log('obj length -> ' + statusResult.length );

        console.log('   -> ' + statusResult[0].hostId);
        console.log('   -> ' + statusResult[0].status.value);
        console.log('   -> ' + statusResult[0].helmChartsContent[0].id);
        console.log('   -> ' + statusResult[0].helmChartsContent[0].informations[0]);    
    }    
}

