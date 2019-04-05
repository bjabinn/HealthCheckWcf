using Back.Models;
using Back.GDrive;
using System;
using System.IO;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Configuration;

using ServiceReference2;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore;
using System.Linq;
using Configuration = System.Configuration.Configuration;

namespace Back
{
    class Program
    {
        public static JsonServicesModel _jsonObject = new JsonServicesModel();
        static void Main(string[] args)
        {
            string json = @"{
                    'configPath': 'files/testConfig.json',
                    'outputPath': 'files/test.json',
                    'pollingRate': 2000
                  }";           

            try
            {
                Configuracion config = JsonConvert.DeserializeObject<Configuracion>(json);

                var GService = GDriveService.GetService("HealthCheckWcf", "GDrive/Files/credentials.json");
                var configuration = Helpers.ReadConfig(config.configPath);
               

                int counter = 0;
                _jsonObject = configuration;

                IntitialLoad(config.outputPath, GService, configuration);

                //Cambiar while(true)
                while (true)
                {
                    counter = 0;
                    foreach (var service in _jsonObject.services)
                    {
                        //Tipo                              
                        if (service.type == "REST") //Funciona mejor con paradas
                        {
                            TimeSpan interval = TimeSpan.FromSeconds(service.intervalSeconds);
                            if (DateTime.Now.Subtract(DateTime.Parse(service.responses[service.responses.Length - 1].Date)) > interval)
                            {

                                System.Console.WriteLine("Lanzarlo" + " " + service.title + " " + DateTime.Now + " --REST-- " );

                                service.responses = new Response[1];
                                APICaller.CheckAPI.MeasureResponse(service, counter, TimeSpan.FromMilliseconds(service.timeoutLimit));
                            }
                            counter++;
                        }
                        else if (service.type == "WCF")
                        {
                            TimeSpan interval = TimeSpan.FromSeconds(service.intervalSeconds);
                            if (DateTime.Now.Subtract(DateTime.Parse(service.responses[service.responses.Length - 1].Date)) > interval)
                            {

                                System.Console.WriteLine("Lanzarlo" + " " + service.title + " " + DateTime.Now + " --WCF-- " );

                                service.responses = new Response[1];
                                APICaller.CheckAPI.MeasureResponse(service, counter, TimeSpan.FromMilliseconds(service.timeoutLimit));

                            }
                            counter++;
                        }
                    }
                    var jsonObject = _jsonObject;

                    if (!Helpers.CompareJsonFileWithObject(config.outputPath,jsonObject) && Helpers.CheckNullResponse(jsonObject))
                    {
                        Helpers.WriteJson(_jsonObject, config.outputPath);
                        GDrive.GDriveService.UpdateJson(config.outputPath, GService);
                    }

                    System.Threading.Thread.Sleep(config.pollingRate);
            }
            }
            catch (Exception ex)
            {               
                Console.WriteLine(ex.Data["ErrorInfo"]);
            }

            Console.WriteLine("Press Enter to exit...");
            Console.ReadLine();
        }


        private static void IntitialLoad(string outputPath, Google.Apis.Drive.v3.DriveService GService, JsonServicesModel configuration)
        {
            int counter = 0;

            foreach (var service in configuration.services)
            {
                _jsonObject.services[counter].responses = new Response[1];

                _jsonObject.services[counter].responses[0] =
                 APICaller.CheckAPI.InitialResponseLoad(service.url, TimeSpan.FromMilliseconds(service.timeoutLimit), service).Result;
                counter++;
            }

            Helpers.WriteJson(_jsonObject, outputPath);
            GDrive.GDriveService.UpdateJson(outputPath, GService);
        }
    }
}
