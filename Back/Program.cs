using Back.Models;
using Back.GDrive;
using System;
using System.IO;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Back
{
    class Program
    {
        static void Main(string[] args)
        {
            const string configPath = "files/testConfig.json";
            const string outputPath = "files/test.json";
            const int pollingRate = 1000;          

            try
            {
                var GService = GDriveService.GetService("HealthCheckWcf","GDrive/Files/credentials.json");
                var configuration = Helpers.ReadConfig(configPath);
                var jsonObject = configuration;

                // GDriveService.UpdateJson(configPath,GService);
                // System.Console.WriteLine(GDrive.GDriveHelper.GetFileID("test.json",service));
                // APICaller.CheckAPI.MeasureResponse("https://jsonplaceholder.typicode.com/todos/1");
                // System.Console.WriteLine(DateTime.Now.ToString("hh:mm:ss.fff"));
                // APICaller.CheckAPI.MeasureResponse("https://jsonplaceholder.typicode.com/photos/1");
                // System.Console.WriteLine(DateTime.Now.ToString("hh:mm:ss.fff"));

                foreach (var service in jsonObject.services)
                {
                    service.responses = new Response[1];

                    service.responses[0] = APICaller.CheckAPI.MeasureResponse(service.url,service.timeoutLimit).Result;
                }

                Helpers.WriteJson(jsonObject, outputPath);
                GDrive.GDriveService.UpdateJson(outputPath, GService);



                while (true)
                {
                    foreach (var service in jsonObject.services)
                    {
                        TimeSpan interval = TimeSpan.FromSeconds(service.intervalSeconds);
                        if (DateTime.Now.Subtract(DateTime.Parse(service.responses[service.responses.Length-1].Date) ) > interval )
                        {
                            
                            System.Console.WriteLine("Lanzarlo" + " " + service.title + " " + DateTime.Now);
                            
                            service.responses = new Response[1];
                            service.responses[0] = APICaller.CheckAPI.MeasureResponse(service.url,service.timeoutLimit).Result;

                        }
                    }
                    System.Threading.Thread.Sleep(pollingRate);
                }
            }

            catch (Exception ex)
            {               
                Console.WriteLine(ex.Data["ErrorInfo"]);
            }

            Console.WriteLine("Press Enter to exit...");
            Console.ReadLine();
        }  
    }
}
