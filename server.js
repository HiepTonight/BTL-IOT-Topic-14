var mysql = require('mysql2');
var express = require("express");
var mqtt = require("mqtt");
var app = express();

//MQTT
var options = {
    protocol: 'mqtts',
    username: 'my_mqtt',
    password: 'hellomqtt',
}
var client = mqtt.connect('tls://897e4e4bd28b411ba2464a4019281121.s1.eu.hivemq.cloud:8883', options);

// đây là mysql
var con = mysql.createConnection({
      host: 'localhost',
      //port: 3306,
      user: 'root',
      password:'',
      database:'wsn'
 });

con.connect(function (err) {
    if (err) throw err;
    console.log("Đã kết nối với MySQL");
})

//Express
var express = require("express");
app.use('/public',express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");

app.get("/",function(req,res){
    res.render("honefinal");
});
app.get("/history",function(req,res){
    res.render("history");
});

//socket.io
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

io.on("connection",function(socket){
    console.log("Thiết bị: " + socket.id+ " vừa truy cập");

    socket.on("disconnect",function(){
        console.log("Thiết bị " + socket.id + " đã ngắt kết nối");
    });
});


client.on('connect',function(){
    console.log("MQTT đã kết nối")
    client.subscribe("sensor")
})

client.on('message',function(topic,message){ //{"temperature":40.321,"humidity":60.324,"dirthumi":72.334} test 
    console.log("Có dữ liệu mới: " + message);
    const data = JSON.parse(message);
    var state_1 = data.state_1;
    var state_2 = data.state_2;
    var temp_data = data.temperature.toFixed(2);
    var humi_data = data.humidity.toFixed(2);
    var dirt_data = data.dirthumi.toFixed(2);

    var sql = "insert into sensordata(Temperature,Humidity,DirtHumidity) value ("+temp_data+" , "+humi_data+" , "+dirt_data+")"
    con.query(sql,function(err,result){
        if (err) throw err
        console.log("Đã update dữ liệu lên DB");
    })

    io.emit("temp",temp_data);
    io.emit("humi",humi_data);
    io.emit("dirthumi",dirt_data);
    io.emit("relay_1",state_1);
    io.emit("relay_2",state_2);
})

//--- Điều khiển thiết bị---van nước----socket
 io.on("connection",function(socket){
     socket.on("control_relay_1",function(state1){
         if(state1=="0"){
             client.publish("relay_1","0")
            //  con.query("insert into relay(relay_id,state) value('relay_1,'ON")
         }else{
             client.publish("relay_1","1")
            //  con.query("insert into relay(relay_id,state) value('relay_1,'OFF")
         }
     })


     socket.on("control_relay_2",function(state2){
         if(state2=="0"){
             client.publish("relay_2","0")
         }else{
             client.publish("relay_2","1")
         }
     })


     socket.on("control_relay_3",function(state3){
         if(state3=="0"){
             client.publish("relay_3","0")
         }else{
             client.publish("relay_3","1")
         }
     })


     socket.on("control_relay_4",function(state4){
         if(state4=="0"){
             client.publish("relay_4","0")
         }else{
             client.publish("relay_4","1")
         }
     })
 })

//Ajax để lấy dữ liệu từ database
app.get('/get_data',function(request, response, next){

    var draw = request.query.draw;

    var start = request.query.start;

    var length = request.query.length;

    var order_data = request.query.order;

    var column_name = 'sensordata.Timemark';
    var column_sort_order = 'desc';

    //Tìm dữ liệu
    var search_value = request.query.search['value'];
    var search_query = `
    AND(Temperature LIKE '%${search_value}%'
    OR Humidity LIKE '%${search_value}%'
    OR DirtHumidity LIKE '%${search_value}%'
    OR Timemark LIKE '%${search_value}%'
    )
    `;

    con.query("SELECT COUNT(*) AS Total FROM sensordata", function(error,data){
        var total_records = data[0].Total;
        con.query(`SELECT COUNT(*) AS Total FROM sensordata WHERE 1 ${search_query}`, function(error,data){
            var total_records_with_filter = data[0].Total;
            var query = `
            SELECT * FROM sensordata 
            WHERE 1 ${search_query} 
            ORDER BY ${column_name} ${column_sort_order} 
            LIMIT ${start}, ${length}
            `;

            var data_arr = [];
            con.query(query,function(error, data){
                data.forEach(function(row){

                    const utcTime = new Date(row.Timemark);
                    const utc07Time = new Date(utcTime.getTime());

                    data_arr.push({
                        'Temperature' : row.Temperature,
                        'Humidity' : row.Humidity,
                        'DirtHumidity' : row.DirtHumidity,
                        'Timemark' : utc07Time.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })  //row.Timemark
                    });
                });

                var output = {
                    'draw' : draw,
                    'iTotalRecords' : total_records,
                    'iTotalDisplayRecords' : total_records_with_filter,
                    'aaData' : data_arr
                };
                response.json(output);
            })
        });
    });

});