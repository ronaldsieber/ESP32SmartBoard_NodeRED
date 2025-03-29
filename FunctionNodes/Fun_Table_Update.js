
var StatusInfo = { fill: "grey", shape: "dot", text: "???" };
var SensorDataRec = [];
var iTemperature;
var iHumidity;
var iCo2Value;
var iCo2SensTemp;
var dtTimeStamp;
var strTimestamp;


// make sure that a data record was received
if ( !msg.topic.includes("StData") )
{
    StatusInfo = { fill: "yellow", shape: "dot", text: msg.topic };
    node.status(StatusInfo);
    return null;
}

// get Sensor Data from StationData Message
iTemperature = msg.payload.Temperature;
iHumidity = msg.payload.Humidity;
iCo2Value = msg.payload.Co2Value;
iCo2SensTemp = msg.payload.Co2SensTemp;

// build Timestamp
dtTimeStamp = new Date();
strTimestamp = dtTimeStamp.getFullYear().toString() + "-" +
               (dtTimeStamp.getMonth() + 1).toString().padStart(2, "0") + "-" +
               dtTimeStamp.getDate().toString().padStart(2, "0") + " - " +
               dtTimeStamp.getHours().toString().padStart(2, "0") + ":" +
               dtTimeStamp.getMinutes().toString().padStart(2, "0") + ":" +
               dtTimeStamp.getSeconds().toString().padStart(2, "0");

// build message to send
SensorDataRec = [
    {
        "id": 1,
        "Sensor": "Temperature",
        "Value": iTemperature.toString(),
        "Timestamp": strTimestamp
    },
    {
        "id": 2,
        "Sensor": "Humidity",
        "Value": iHumidity.toString(),
        "Timestamp": strTimestamp
    },
    {
        "id": 3,
        "Sensor": "Co2Value",
        "Value": iCo2Value.toString(),
        "Timestamp": strTimestamp
    },
    {
        "id": 4,
        "Sensor": "Co2SensTemp",
        "Value": iCo2SensTemp.toString(),
        "Timestamp": strTimestamp
    }
];

// set NodeStatus text
StatusInfo = { fill: "green", shape: "ring", text: "Table updated at: " + strTimestamp };
node.status(StatusInfo);

msg.payload = SensorDataRec;
return msg;

