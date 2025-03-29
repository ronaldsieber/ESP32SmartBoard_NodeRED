
var StatusInfo = { fill: "grey", shape: "dot", text: "???" };
var Msg_Uptime = {};
var Msg_Temperature = {};
var Msg_Humidity = {};
var Msg_Co2Value = {};
var iUptimeSeconds;
var iDays;
var iHours;
var iMinutes;
var iSeconds;
var strUptime;


// make sure that a data record was received
if ( !msg.topic.includes("StData") )
{
    StatusInfo = { fill: "yellow", shape: "dot", text: msg.topic };
    node.status(StatusInfo);
    return [null, null, null];
}

// get Uptime from StationData Message
iUptimeSeconds = msg.payload.Uptime;
iDays = Math.floor(iUptimeSeconds / 86400);
iUptimeSeconds %= 86400;
iHours = Math.floor(iUptimeSeconds / 3600);
iUptimeSeconds %= 3600;
iMinutes = Math.floor(iUptimeSeconds / 60);
iSeconds = iUptimeSeconds % 60;

strUptime = iDays.toString() + "d/" +
            iHours.toString().padStart(2, "0") + ":" +
            iMinutes.toString().padStart(2, "0") + ":" +
            iSeconds.toString().padStart(2, "0");
Msg_Uptime.payload = strUptime;

// get Sensor Data from StationData Message
Msg_Temperature.payload = msg.payload.Temperature;
Msg_Humidity.payload = msg.payload.Humidity;
Msg_Co2Value.payload = msg.payload.Co2Value;

// set NodeStatus text
StatusInfo = { fill: "green", shape: "ring", text: "Tmp: " + Msg_Temperature.payload.toString() + "; " +
                                                   "Hum: " + Msg_Humidity.payload.toString() + "; " +
                                                   "CO2: " + Msg_Co2Value.payload.toString() };
node.status(StatusInfo);

return [Msg_Uptime, Msg_Temperature, Msg_Humidity, Msg_Co2Value];

