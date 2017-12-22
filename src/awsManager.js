/**
 * Created by xadrian on 5/12/17.
 */
var AWS                     = require('aws-sdk');
const AWS_ACCESS_KEY_ID     = process.env.I_AWS_ACCESS_KEY_ID || "AKIAIQO2L2TVHP67CG4Q";
const AWS_SECRET_ACCESS_KEY = process.env.I_AWS_SECRET_ACCESS_KEY || "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";
const AWS_REGION            = process.env.AWS_REGION || "us-east-1";
const GROUP_NAME            = process.env.GROUP_NAME || "45";
const ENVIROMENT            = process.env.ENVIROMENT || "DEV";
class awsManager {

    constructor() {
        if(ENVIROMENT == 'DEV'){
            AWS.config.update({region: AWS_REGION, accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY});
        }
        this.lambda = new AWS.Lambda({
            region: AWS_REGION
        });
    }

    executeLambda(functionName, args) {
        let self = this;
        return new Promise((resolve, reject)=> {
            args['mode'] = 'REST';
            args['groupName'] = GROUP_NAME;
            
            console.log(`Ejecutando funcion lambda ${functionName} :`);
            console.log(JSON.stringify(args, null, 4));

            self.lambda.invoke({
                FunctionName: functionName,
                Payload: JSON.stringify(args, null, 2),
            }, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                    return reject(err);
                }
                else {
                    if (data.StatusCode == 200) {
                        
                        var result = JSON.parse(data.Payload);
                        if(result){
                            if (data.FunctionError) {
                                return reject(data.FunctionError);
                            } else {
                                if (result.type == 'Buffer') {
                                    resolve({StatusCode: 200, data: Buffer.from(result.data)});
                                } else {
                                    resolve({StatusCode: 200, data: result});
                                }
                            }
                        }else{
                            return reject('no devolvio data');
                        }

                    } else {
                        return reject('Error desconocido');
                    }
                }
            });

        })
    }


}
module.exports = new awsManager();
