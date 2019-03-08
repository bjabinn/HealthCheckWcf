namespace Back.Models
{
    public class JsonServicesModel
    {
        public Service[] Services { get; set; }
    }

    public class Service
    {
        public string Title { get; set; }
        public int IntervalSeconds { get; set; }
        public Respons[] Responses { get; set; }
    }

    public class Respons
    {
        public int Time { get; set; }
        public string Date { get; set; }
    }
}
