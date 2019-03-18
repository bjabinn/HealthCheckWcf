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
        private static async Task<bool> CallAPI(string url, TimeSpan timeOut)
        {
            HttpResponseMessage response = null;

            using (HttpClient client = new HttpClient())
            {
                try	
                {
                    client.Timeout = timeOut;
                    response = await client.GetAsync(url);
                    response.EnsureSuccessStatusCode();
                    // string responseBody = await response.Content.ReadAsStringAsync();

                    // return responseBody.;
                    return true;
                }  
                catch(HttpRequestException e)
                {
                    System.Console.WriteLine(string.Format("\nERROR: Failed while contacting API in \"{0}\" with exception: {1}", url, e.Message));
                    return false;
                }
                catch(TaskCanceledException ex)
                {
                    return false;
                }
            }
        }

        public static async void MeasureResponse(Service service, int index, TimeSpan timeOut)
        {
            Stopwatch ResponseTimer = new Stopwatch();

            try
            {
                ResponseTimer.Start();
                await CallAPI(service.url, timeOut);
                ResponseTimer.Stop();

                Back.Program._jsonObject.services[index].responses = new Response[1];
                Back.Program._jsonObject.services[index].responses[0] = new Response((int)ResponseTimer.ElapsedMilliseconds,DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss.FFF"));
            }
            catch (System.Exception e)
            {
                System.Console.WriteLine(string.Format("\nERROR: Failed while contacting API in \"{0}\" with exception: {1}", service.url, e.Message));
            }
        }

        public static async Task<Response> InitialResponseLoad(string url, TimeSpan timeOut)
        {
            Stopwatch ResponseTimer = new Stopwatch();
            
            try
            {
                ResponseTimer.Start();
                await CallAPI(url, timeOut);
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