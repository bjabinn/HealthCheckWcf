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
            string path = "files/test.json";

            var jsonObject = new JsonServicesModel();

            try
            {
                var GService = GDriveService.GetService("HealthCheckWcf","GDrive/Files/credentials.json");
                var configuration = Helpers.ReadConfig(configPath);

                Helpers.WriteJson(configuration, path);

                GDriveService.UpdateJson(path,GService);
                // System.Console.WriteLine(GDrive.GDriveHelper.GetFileID("test.json",service));
                // APICaller.CheckAPI.MeasureResponse("https://jsonplaceholder.typicode.com/todos/1");
                // System.Console.WriteLine(DateTime.Now.ToString("hh:mm:ss.fff"));
                // APICaller.CheckAPI.MeasureResponse("https://jsonplaceholder.typicode.com/photos/1");
                // System.Console.WriteLine(DateTime.Now.ToString("hh:mm:ss.fff"));

                Response TestResponse = APICaller.CheckAPI.MeasureResponse("https://jsonplaceholder.typicode.com/todos/1").Result;

                foreach (var service in configuration.services)
                {
                    service.responses = new Response[1];

                    service.responses[0] = APICaller.CheckAPI.MeasureResponse(service.url).Result;
                }

                while (true)
                {
                    
                    foreach (var item in configuration.services)
                    {
                        System.Console.WriteLine(item.responses[0]);
                    }

                    System.Threading.Thread.Sleep(1000);
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
