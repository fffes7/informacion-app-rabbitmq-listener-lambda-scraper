/**
 * Created by xadrian on 7/11/17.
 */
var amqp           = require('amqplib');
const QUEUE_HOST   = process.env.QUEUE_HOST || '172.17.0.2';//'rbmq.autofact.qa';
const QUEUE_PORT   = process.env.QUEUE_PORT || 5672;
const QUEUE_USER   = process.env.QUEUE_USER || 'user';
const QUEUE_PASSWD = process.env.QUEUE_PASSWD || 'user';
const QUEUE_VHOST  = process.env.QUEUE_VHOST || '';

class RabbitHelper {
    sendToRabbit(queue, message = {}) {
        return new Promise((resolve, reject)=> {
            amqp.connect('amqp://' + QUEUE_USER + ':' + QUEUE_PASSWD + '@' + QUEUE_HOST + ':' + QUEUE_PORT + '/' + QUEUE_VHOST).then((connection) => {
                console.log('Connection established');
                return connection.createChannel().then((channel) => {
                    console.log('Channel connected');
                    const queueCheckOk = channel.assertQueue(queue);
                    return queueCheckOk.then(() => {
                        console.log('Queue asserted');
                        console.log(`Sending message "${message}" to queue ${queue}`);
                        channel.sendToQueue(queue, new Buffer(message), {contentType: "text/plain"});
                        return channel.close();
                    });
                }).finally(() => {
                    console.log('Closing connection');
                    connection.close();
                });
            }).then(resolve).catch(error=> {
                console.log(error);
                return reject(error);
            });
        })

    };

    consumerFromRabbit(queue, _function) {
        return new Promise((resolve, reject)=> {
             amqp.connect('amqp://' + QUEUE_USER + ':' + QUEUE_PASSWD + '@' + QUEUE_HOST + ':' + QUEUE_PORT + '/' + QUEUE_VHOST).then((conn) => {
                console.log('Connection established');
                 return conn.createChannel().then(ch=>{

                     var ok = ch.assertQueue(queue, {durable: true});

                     ok = ok.then(_qok=>{
                         return ch.consume(queue, msg=> {
                             console.log(" [x] Received '%s'", msg.content.toString());
                             _function(msg.content.toString());
                         }, {noAck: true});
                     });

                     return ok.then(_consumeOk=>{
                         console.log(' [*] Waiting for messages. To exit press CTRL+C');
                     });
                 });
            }).catch(reject);
        });
    }
}
module.exports = new RabbitHelper();
