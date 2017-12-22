/**
 * Created by xadrian on 20/12/17.
 */
const FUNCTION_NAME = process.env.FUNCTION_NAME || 'backend-scraper-pe-trujillo';
const QUEUE = process.env.QUEUE || 'micola';
var RabbitFunctions = require('./src/RabbitFunctions');
var awsManager = require('./src/awsManager');
exports.handler = ()=>{

    RabbitFunctions.consumerFromRabbit(QUEUE, (message)=>{
        try{
            let messageJson = JSON.parse(message);
            awsManager.executeLambda(FUNCTION_NAME,messageJson).then(data=>{
                console.log('entrada:')
                console.log(JSON.stringify(messageJson, null, 4));
                console.log('salida:')
                console.log(JSON.stringify(data, null, 4));
            }).catch(error=>{
                console.log("ocurrio un error", error);
                RabbitFunctions.sendToRabbit(QUEUE,message);
            });
        }catch(e){
           console.log(`entrada invalida`); 
        }
         
      });


}
exports.produce = (callback)=> {
    RabbitFunctions.sendToRabbit(QUEUE, `{
                                                "request": {
                                                    "idRequest": 42,
                                                        "inputData": "T1F799"
                                                },
                                                "groupName": "op32"
                                            }`
    ).then(callback).catch(callback);
}