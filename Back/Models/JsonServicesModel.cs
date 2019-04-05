using Newtonsoft.Json;

namespace Back.Models
{
    public class JsonServicesModel
    {
        public Service[] services { get; set; }
        public Configuracion[] configuracion { get; set; }
    }

    public class Service
    {
        public string title { get; set; }
        public string url { get; set; }
        public string type { get; set; }
        public string method { get; set; }
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

    public class Configuracion
    {
        public string configPath { get; set; }
        public string outputPath { get; set; }
        public int pollingRate { get; set; }
    }

}
