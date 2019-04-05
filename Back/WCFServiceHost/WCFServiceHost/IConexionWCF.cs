using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace WCFServiceHost
{
    [ServiceContract]
    public interface IConexionWCF
    {
        [OperationContract]
        string GetMessage(string name);
        [OperationContract]
        string GetData(string value);
        [OperationContract]
        string MostrarMensaje();

    }

    


}