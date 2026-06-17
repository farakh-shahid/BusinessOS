/** Minimal i18n shape required by order receipt / measurement HTML builders. */
export interface DocumentDictionary {
  appName: string;
  appTagline: string;
  receipt: Record<string, string>;
  form: Record<string, string>;
  garments: Record<string, string>;
  print: Record<string, string>;
  measurements: Record<string, string>;
  style: Record<string, string>;
  orderDetail: Record<string, string>;
}
