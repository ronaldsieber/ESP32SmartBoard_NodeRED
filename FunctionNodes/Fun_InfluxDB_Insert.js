
var  strTopic;
var  astrTopicItems;
var  strPayload;
var  strSensor;
var  strMeasurement;
var  Value;
var  iIdx;

strTopic = msg.topic;
strPayload = msg.payload;

// get sensor name (right part of topic after last slash)
iIdx = strTopic.lastIndexOf('/');
strSensor = strTopic.substring(iIdx + 1);

// get measurement name (following to 'SmBrd/')
astrTopicItems = strTopic.split("/");
strMeasurement = astrTopicItems[1];

// parse sensor value
Value = parseFloat(strPayload);
if ( isNaN(Value) )
{
    Value = strPayload;
}

// build message to send
msg.payload = {
    [strSensor]: Value
}
// the measurement property is reused by the InfluxDB Node,
// therefore the measurement name does not need to by specified
// in the InfluxDB Node itself (allows more generic flow)
msg.measurement = strMeasurement;

return msg;

