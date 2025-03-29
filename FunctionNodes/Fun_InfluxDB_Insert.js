
var StatusInfo = { fill: "grey", shape: "dot", text: "???" };
var Msg_DB_Entry = {};
var DB_Entry = {};
var strTopic;
var astrTopicItems;
var strDevName;
var strRecordType;
var strMeasurement;


// split the received MQTT Topic into its individual parts
strTopic = msg.topic;
astrTopicItems = strTopic.split("/");

// get DevName (following to 'SmBrd/')
strDevName = astrTopicItems[1];

// get RecordType (last part of Topic)
strRecordType = astrTopicItems[astrTopicItems.length - 1];

// build Measurement Name depending on RecordType
strMeasurement = strDevName + '_' + strRecordType;

// move Data from received Message to DB_Entry Message
if (strRecordType == "StData")
{
    // move Sensor Data from StationData Message to DB_Entry Object
    DB_Entry.PacketNum     = msg.payload.PacketNum;
    DB_Entry.MainLoopCycle = msg.payload.MainLoopCycle;
    DB_Entry.Uptime        = msg.payload.Uptime;
    DB_Entry.NetErrorLevel = msg.payload.NetErrorLevel;
    DB_Entry.Key0          = msg.payload.Key0;
    DB_Entry.Key1          = msg.payload.Key1;
    DB_Entry.Temperature   = msg.payload.Temperature;
    DB_Entry.Humidity      = msg.payload.Humidity;
    DB_Entry.Co2Value      = msg.payload.Co2Value;
    DB_Entry.Co2SensTemp   = msg.payload.Co2SensTemp;

    // move DB_Entry Object to DB_Entry Message
    Msg_DB_Entry.payload = DB_Entry;
}
else
{
    // move Data from Bootup Message to DB_Entry Message
    Msg_DB_Entry.payload = msg.payload;
}

// the measurement property is reused by the InfluxDB Node,
// therefore the Measurement Name does not need to be specified
// in the InfluxDB Node itself (allows more generic flow)
Msg_DB_Entry.measurement = strMeasurement;

// set NodeStatus text
StatusInfo = { fill: "green", shape: "ring", text: "Ins PacketNum=" + Msg_DB_Entry.payload.PacketNum.toString() +
                                                   " to: '" + strMeasurement + "'" };
node.status(StatusInfo);

return Msg_DB_Entry;

