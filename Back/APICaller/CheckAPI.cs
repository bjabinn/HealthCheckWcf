using Newtonsoft.Json;
using System.Diagnostics;
using System.Net.Http;
using System;
using System.Threading.Tasks;
using Back.Models;
using Back;
using ServiceReference2;

using Notification;
using Scheduler;
using Subscription;
using System.ServiceModel;



namespace Back.APICaller
{
    class CheckAPI
    {
        private static async Task<bool> CallAPIrest(string url, TimeSpan timeOut)
        {
            HttpResponseMessage response = null;
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.Timeout = timeOut;
                    response = await client.GetAsync(url);
                    response.EnsureSuccessStatusCode();
                    
                    return true;
                }
                catch (Exception e)
                {
                System.Console.WriteLine(string.Format("\nERROR: Failed while contacting API in \"{0}\" with exception: {1}", url, e.Message));
                return false;
                }
        }
        }

        private static async Task<bool> CallAPIwcf(string url, TimeSpan timeOut) 
        {
            HttpResponseMessage response = null;

            //var cliente = new ConexionWCFClient();
            //var respuesta = await cliente.MostrarMensajeAsync();


            //var cliente = new SubscriptionServiceClient();
            //var userId = new Subscription.UserIdentity();

            //userId.Id = "3009271842";

            //var context = new Subscription.CallContext();
            //context.business = "Grocery";
            //context.channel = "Subscriptions";
            //context.LanguageField = "EN";
            //context.RegionField = "GB";
            //context.UserIdentityField = userId;

            //var respuesta = await cliente.GetAllSegmentsAsync(context);

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.Timeout = timeOut;
                    response = await client.GetAsync(url);
                    response.EnsureSuccessStatusCode();
                    System.Console.WriteLine(respuesta + "--WCF--");

                    return true;
                }
                catch (Exception e)
                {
                    System.Console.WriteLine(string.Format("\nERROR: Failed while contacting API in \"{0}\" with exception: {1}", url, e.Message));
                    return false;
                }
            }
        }

        public static async void MeasureResponse(Service service, int index, TimeSpan timeOut)
        {
            Stopwatch ResponseTimer = new Stopwatch();

            if(service.type == "REST") 
            {
                try
                {
                    ResponseTimer.Start();
                    await CallAPIrest(service.url, timeOut);
                    ResponseTimer.Stop();

                    Back.Program._jsonObject.services[index].responses = new Response[1];
                    Back.Program._jsonObject.services[index].responses[0] = new Response((int)ResponseTimer.ElapsedMilliseconds, DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss.FFF"));
                    Console.WriteLine(ResponseTimer.ElapsedMilliseconds);
                }

                catch (System.Exception e)
                {
                    System.Console.WriteLine(string.Format("\nERROR: Failed while contacting API in \"{0}\" with exception: {1}", service.url, e.Message));
                }
            }
            else if (service.type == "WCF")
            {
                try
                {
                    ResponseTimer.Start();
                    await CallAPIwcf(service.url, timeOut);
                    ResponseTimer.Stop();

                    Back.Program._jsonObject.services[index].responses = new Response[1];
                    Back.Program._jsonObject.services[index].responses[0] = new Response((int)ResponseTimer.ElapsedMilliseconds, DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss.FFF"));
                    Console.WriteLine(ResponseTimer.ElapsedMilliseconds);
                }
                catch (System.Exception e)
                {
                    System.Console.WriteLine(string.Format("\nERROR: Failed while contacting API in \"{0}\" with exception: {1}", service.url, e.Message));
                }
            }
        }

        public static async Task<Response> InitialResponseLoad(string url, TimeSpan timeOut, Service service)
        {
            Stopwatch ResponseTimer = new Stopwatch();
           
                if(service.type == "REST")
                {
                try
                {
                    ResponseTimer.Start();
                            await CallAPIrest(url, timeOut);
                            ResponseTimer.Stop();
                }
                catch (System.Exception e)
                {
                    System.Console.WriteLine(string.Format("\nERROR: Failed while contacting API in \"{0}\" with exception: {1}", url, e.Message));
                }
            }
                else if(service.type == "WCF")
                {
                    try
                        {
                            ResponseTimer.Start();
                            await CallAPIwcf(url, timeOut);
                            ResponseTimer.Stop();
                        }catch(System.Exception e)
                        {
                            System.Console.WriteLine(string.Format("\nERROR: Failed while contacting API in \"{0}\" with exception: {1}", url, e.Message));
                        }
                }
                    
            return new Response((int)ResponseTimer.ElapsedMilliseconds,DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss.FFF"));
        }
    }    
}