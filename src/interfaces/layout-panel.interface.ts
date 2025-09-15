export interface IPanel {
  componentType: "panel";
  id: string;
  title?: string;
  subtitle?: string;
  userStory?: string;
  icon?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  headerActions?: IPanelAction[];
  content: {
    type: "component" | "html" | "markdown";
    component?: {
      type: "dataTable" | "dataGrid" | "dataCard" | "dataChart" | "form";
      config: any; // Referência para outra configuração de componente
    };
    html?: string;
    markdown?: string;
  };
  styling?: {
    variant?: "default" | "outlined" | "elevated" | "flat";
    padding?: "none" | "small" | "medium" | "large";
    maxHeight?: string;
    scrollable?: boolean;
  };
}

export interface IPanelAction {
  icon?: string;
  label?: string;
  action: {
    type: "link" | "request" | "event";
    link?: {
      route: string;
    };
    request?: {
      endpoint: string;
      method: "GET" | "POST" | "PUT" | "DELETE";
    };
    event?: {
      name: string;
      data?: any;
    };
  };
}
