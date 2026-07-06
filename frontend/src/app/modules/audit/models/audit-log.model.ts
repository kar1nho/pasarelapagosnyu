export interface AuditLog {
  id:            number;
  orderId:       number;
  eventType:     string;
  prevStatus?:   string;
  newStatus?:    string;
  targetSystem?: string;
  payload?:      any;
  result?:       string;
  actor:         string;
  createdAt:     string;
}