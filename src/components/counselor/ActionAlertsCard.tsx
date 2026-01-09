import { MessageSquare, CheckCircle, AlertCircle, X } from "lucide-react";
import { useState } from "react";

interface Alert {
  id: string;
  type: "message" | "confirmation" | "alert" | "appointment" | "action_required" | "financial";
  priority?: "high" | "medium" | "low";
  title: string;
  description?: string;
  message?: string;
  time: string;
  action_url?: string;
  action_label?: string;
  count?: number;
  amount?: number;
}

interface ActionAlertsCardProps {
  alerts: Alert[];
}

export function ActionAlertsCard({ alerts: initialAlerts }: ActionAlertsCardProps) {
  // Ensure alerts is always an array
  const safeInitialAlerts = Array.isArray(initialAlerts) ? initialAlerts : [];
  const [alerts, setAlerts] = useState(safeInitialAlerts);

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-5 h-5" />;
      case "confirmation":
      case "action_required":
        return <CheckCircle className="w-5 h-5" />;
      case "alert":
      case "appointment":
        return <AlertCircle className="w-5 h-5" />;
      case "financial":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "message":
        return "bg-blue-100 text-blue-700";
      case "confirmation":
      case "action_required":
        return "bg-amber-100 text-amber-700";
      case "alert":
      case "appointment":
        return "bg-teal-100 text-teal-700";
      case "financial":
        return "bg-green-100 text-green-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Action Alerts</h3>
      
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No alerts at this time</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getAlertColor(alert.type)}`}>
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 mb-1 font-medium">{alert.title}</p>
                <p className="text-xs text-gray-500 mb-2">{alert.description || alert.message}</p>
                <p className="text-xs text-gray-400">
                  {typeof alert.time === 'string' && alert.time.includes('T') 
                    ? new Date(alert.time).toLocaleString() 
                    : alert.time}
                </p>
              </div>
              
              <button
                onClick={() => dismissAlert(alert.id)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}