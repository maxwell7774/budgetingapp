/*
type Link struct {
	Href      string `json:"href"`
	Method    string `json:"method,omitempty"`
	Title     string `json:"title,omitempty"`
	Templated bool   `json:"templated,omitempty"`
	Name      string `json:"name,omitempty"`
}
*/

type HTTPMethod = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
export interface Link {
  href: string;
  method?: HTTPMethod;
  title?: string;
  templated?: boolean;
  name?: string;
}

export interface Resource {
  _links: Record<string, Link>;
}

export interface Collection<T extends Resource> {
  page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
  _links: Record<string, Link>;
  _embedded: { items: T[] };
}
