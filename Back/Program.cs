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
                Tiempo = 2858888
            };

            try
            {
                Helpers.WriteJson(model1, path);
                var service = GDrive.GDriveService.GetService("HealthCheckWcf","GDrive/Files/credentials.json");
                //GDriveHelper.UploadJson(path, service); 
                
                GDrive.GDriveHelper.UpdateJson(path,service);
                System.Console.WriteLine(GDrive.GDriveHelper.GetFileID("test.json",service));

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
