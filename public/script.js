 var sidebarOpen = false;
 var sidebar = document.getElementById("sidebar");

 function openSidebar(){
     if(!sidebarOpen){
         sidebar.classList.add("sidebar-responsive");
         sidebarOpen = True;
     }
 }

 function closeSidebar(){
     if(sidebarOpen){
         sidebar.classList.remove("sidebar-responsive")
         sidebarOpen = False;
     }
 }


//socket
const socket=io()

socket.on("temp",function(data_received){
  let giatri_temp = data_received
  document.getElementById("nhietdo_hienthi").innerHTML = giatri_temp + "°C";

  if(giatri_temp<15){
    document.getElementById("canhbaonhietdo").innerHTML = "Nhiệt độ thấp! Cần bật đèn sưởi";
  }
  else if(15<=giatri_temp<=30){
    document.getElementById("canhbaonhietdo").innerHTML = "Nhiệt độ bình thường";
  }
  else{
    document.getElementById("canhbaonhietdo").innerHTML = "Nhiệt độ nóng! Không được bật đèn sưởi";
  }

  update_chart_temp.data.datasets[0].data.push(giatri_temp)
  const maxDataPoints = 20;
  if (update_chart_temp.data.datasets[0].data.length > maxDataPoints) {
    update_chart_temp.data.datasets[0].data.shift();
  }
  const formattedTime = moment().format('HH:mm:ss, DD/MM/YYYY');
  update_chart_temp.data.labels.push(formattedTime);
  if (update_chart_temp.data.labels.length > maxDataPoints) {
    update_chart_temp.data.labels.shift();
  }
  update_chart_temp.update();
})

socket.on("humi",function(data_received){
  let giatri_humi = data_received
  document.getElementById("doam_hienthi").innerHTML = giatri_humi + "%";

  update_chart_humi.data.datasets[0].data.push(giatri_humi)
  const maxDataPoints = 20;
  if (update_chart_humi.data.datasets[0].data.length > maxDataPoints) {
    update_chart_humi.data.datasets[0].data.shift();
  }
  const formattedTime = moment().format('HH:mm:ss, DD/MM/YYYY');
  update_chart_humi.data.labels.push(formattedTime);
  if (update_chart_humi.data.labels.length > maxDataPoints) {
    update_chart_humi.data.labels.shift();
  }
  update_chart_humi.update();
})

socket.on("dirthumi",function(data_received){
  let giatri_dirthumi = data_received
  document.getElementById("doamdat_hienthi").innerHTML = giatri_dirthumi + "%";

  if(giatri_dirthumi<66){
    document.getElementById("canhbaodoam").innerHTML = "Đất khô! Cần phải bơm nước";
  }
  else if(66<=giatri_dirthumi<=88){
    document.getElementById("canhbaodoam").innerHTML = "Độ ẩm bình thường";
  }
  else{
    document.getElementById("canhbaodoam").innerHTML = "Đất ướt! Không cần phải bơm thêm nước";
  }

  update_chart_humi.data.datasets[1].data.push(giatri_dirthumi)
  const maxDataPoints = 20;
  if (update_chart_humi.data.datasets[1].data.length > maxDataPoints) {
    update_chart_humi.data.datasets[1].data.shift();
  }
  const formattedTime = moment().format('HH:mm:ss, DD/MM/YYYY');
  update_chart_humi.data.labels.push(formattedTime);
  if (update_chart_humi.data.labels.length > maxDataPoints) {
    update_chart_humi.data.labels.shift();
  }
  update_chart_humi.update();
})



//cjhart
const update_chart_temp = new Chart("tempChart", {
    type: "line",
    data: {
      labels: [],
      datasets: [{
          label: "Nhiệt độ",
          lineTension: 0,
          backgroundColor: "red",      
          borderColor: "red",         
          data: []}]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          title:{
              display: true,
              text: "Thời gian",
          }
        },
        y: {
          title:{
              display: true,
              text: "Giá trị",
          }
        },
      }
    }
})

const update_chart_humi = new Chart("humiChart", {
    type: "line",
    data: {
      labels: [],
      datasets: [{
          label: "Độ ẩm môi trường",
          lineTension: 0,
          backgroundColor: "blue",      
          borderColor: "blue",         
          data: []},
          {
          label:"Độ ẩm đất",
          lineTension:0,
          backgroundColor:"green",      
          borderColor:"green",         
          data:[]
          }
        ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          title:{
              display: true,
              text: "Thời gian",
          }
        },
        y: {
          title:{
              display: true,
              text: "Giá trị",
          }
        },
      }
    }
})

//Điều khiển thiết bị

function kiemtra_on_off_vannuoc1() {
  var listItem = document.getElementById('van-nuoc-1');
  var checkbox = document.getElementById('checkbox-vannuoc1');
  if (checkbox.checked) {
    var result = confirm("Bạn có muồn mở van nước không ?")
    if(result){
      listItem.style.backgroundColor=' rgb(145, 139, 197)';
      socket.emit("control_relay_1","0");
    }
    else{
      checkbox==false
    }
  } else {
      listItem.style.backgroundColor=' #29d8ff';
      socket.emit("control_relay_1","1");
  }
}

function kiemtra_on_off_vannuoc2() {
  var listItem = document.getElementById('van-nuoc-2');
  var checkbox = document.getElementById('checkbox-vannuoc2');
  if (checkbox.checked) {
    var result = confirm("Bạn có muồn mở van nước không ?")
    if(result){
      listItem.style.backgroundColor=' rgb(145, 139, 197)';
      socket.emit("control_relay_2","0");
    }
    else{
      checkbox==false
    }
  } else {
      listItem.style.backgroundColor='rgb(0, 136, 255)';
      socket.emit("control_relay_2","1");
  }
}

function kiemtra_on_off_bongden() {
  var listItem = document.getElementById('bong-den');
  var checkbox = document.getElementById('checkbox-bongden');
  if (checkbox.checked) {
    var result = confirm("Bạn có muồn bật bóng đèn không ?")
    if(result){
      listItem.style.backgroundColor=' rgb(145, 139, 197)';
      socket.emit("control_relay_3","0");
    }
    else{
      checkbox==false
    }
  } else {
      listItem.style.backgroundColor='#c0c310';
      socket.emit("control_relay_3","1");
  }
}
function kiemtra_on_off_densuoi() {
  var listItem = document.getElementById('den-suoi');
  var checkbox = document.getElementById('checkbox-densuoi');
  if (checkbox.checked) {
    var result = confirm("Bạn có muồn bật đèn sưởi không ?")
    if(result){
      listItem.style.backgroundColor=' rgb(145, 139, 197)';
      socket.emit("control_relay_4","0");
    }
    else{
      checkbox==false
    }
  } else {
      listItem.style.backgroundColor='#d57500';
      socket.emit("control_relay_4","1");
  }
}