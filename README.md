# BTL-IOT-Topic-14
## MQTT Broker
MQTT Broker mình sử dụng chính trong Project là HiveMq-MQTT
```
 var options = {
    protocol: 'mqtts',
    username: 'your_username',
    password: '',
}
var client = mqtt.connect('YourMQTT Broker URL', options);
```

## Cơ sở dữ liệu
Database mình sủ dụng là MySql. Trong cơ sở dữ liệu tạo một bảng có tên “sensordata” chứa 4 cột dữ liệu, trong đó ứng với từng dữ liệu thu thập được từ cảm biến: Time,Temp,Humi,DirtHumi

## Toàn bộ web
Giao diện chính của Website
![Screenshot 2023-11-10 184402](https://github.com/HiepTonight/BTL-IOT-Topic-14/assets/138226695/3b30aa49-2fb1-41fc-aa9a-07bcf7120afb)

Giao diện xem dữ liệu thu được từ cảm biến lưu trên Database
![Screenshot 2023-11-10 231823](https://github.com/HiepTonight/BTL-IOT-Topic-14/assets/138226695/f5fba429-f798-4485-935a-d990b162d6d8)
