
var StatusInfo = { fill: "grey", shape: "dot", text: "???" };
var strTopic;
var astrTopicItems;
var iPacketNum;


// make sure that a data record was received
if ( !msg.topic.includes("StData") )
{
    StatusInfo = { fill: "yellow", shape: "dot", text: msg.topic };
    node.status(StatusInfo);
    return null;
}

// split the received MQTT Topic into its individual parts
strTopic = msg.topic;
astrTopicItems = strTopic.split("/");

// build topic for acknowledge message
strTopic = astrTopicItems[0] + "/" + astrTopicItems[1] + "/Ack/PacketNum";

// get PacketNum from StationData Message
iPacketNum = msg.payload.PacketNum;

// set NodeStatus text
StatusInfo = { fill: "green", shape: "ring", text: "ACK PacketNum:" + iPacketNum.toString() };
node.status(StatusInfo);

msg.topic = strTopic;
msg.payload = iPacketNum;

return msg;

