using Newtonsoft.Json;
using System.Diagnostics;
using System.Net.Http;
using System;
using System.Threading.Tasks;
using Back.Models;
using Back;

namespace Back.APICaller
{
    class CheckAPI
    {
        private static async Task<string> CallAPI(string url)
        {
            HttpResponseMessage response = null;

            using (HttpClient client = new HttpClient())
            {
                try	
                {
                    response = await client.GetAsync(url);
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();

                    return responseBody;
                }  
                catch(HttpRequestException e)
                {
                    e.Data["ErrorInfo"] += string.Format("\nERROR: Failed while contacting API in \"{0}\" with exception: {1}", url, e.Message);
                    throw e;
                }
            }
        }

        public static async void MeasureResponse(Service service, int index)
        {
            Stopwatch ResponseTimer = new Stopwatch();

            try
            {
                ResponseTimer.Start();
                await CallAPI(service.url);
                ResponseTimer.Stop();

                Back.Program._jsonObject.services[index].responses = new Response[1];
                Back.Program._jsonObject.services[index].responses[0] = new Response((int)ResponseTimer.ElapsedMilliseconds,DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss.FFF"));
            }
            catch (System.Exception e)
            {
                
                System.Console.WriteLine(string.Format("\nERROR: Failed while contacting API in \"{0}\" with exception: {1}", service.url, e.Message));
                
            }
        }

        public static async Task<Response> InitialResponseLoad(string url, int timeoutLimit)
        {
            Stopwatch ResponseTimer = new Stopwatch();
            
            try
            {
                ResponseTimer.Start();
                await CallAPI(url);
                ResponseTimer.Stop();
            }
            catch (System.Exception e)
            {
                System.Console.WriteLine(string.Format("\nERROR: Failed while contacting API in \"{0}\" with exception: {1}", url, e.Message));
            }

            return new Response((int)ResponseTimer.ElapsedMilliseconds,DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss.FFF"));
        }
    }    
}