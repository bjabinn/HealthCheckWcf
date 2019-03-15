using Newtonsoft.Json;

namespace Back.Models
{
    public class JsonServicesModel
    {
        public Service[] services { get; set; }
    }

    public class Service
    {
        public string title { get; set; }
        [JsonIgnore]
        public string url { get; set; }
        public int timeoutLimit {get; set; }
        public int intervalSeconds { get; set; }
        public Response[] responses { get; set; }
    }

    public class Response
    {
        public Response(int Time,string Date){
            this.Time = Time;
            this.Date = Date;
        }

        public int Time { get; set; }
        public string Date { get; set; }
    }
}
