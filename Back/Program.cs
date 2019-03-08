using Back.Models;
using System;

namespace Back
{
    class Program
    {
        static void Main(string[] args)
        {
            string path = "files/test.json";
            var model1 = new CredentialModel
            {
                Apellidos = "Gadea",
                Nombre = "Jose Carlos",
                Tiempo = 150
            };

            try
            {
                JsonWriter.WriteJson(model1, path);
                var service = GDriveService.GetService("HealthCheckWcf","credentials.json");
                UploadDrive.UploadJson(path, service); 
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
