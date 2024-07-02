export interface Advisor {
  id: number;
  name: string;
  last_name: string;
  email: string;
}

export interface Activity {
  id: number;
  advisor_name: string;
  contact_name: string;
  last_activity: string;
  messages: {
    type: string;
    content: {
      body: string;
    }
  }
}

export interface Tag {
  id: number;
  text: string;
  color: string;
}

export interface Contact {
  id: number;
  name: string;
  num_phone: string;
  interes_en: string;
  email: any;
  student: any;
}

export interface Contacts{
  number: number
}

export interface Date{
  month: number,
  year: number
}

export interface DateRemenber {
  id: number;
  date_to_remenber: string;
  time_to_remenber: string;
  conversation_id: number;
  status: any;
}

export interface Conversation {
  id: number,
  contact: Contact;
  messages: Message;
  date_remenber: DateRemenber;
  status_assignments: number;
  advisorName: string;
  updated_at: string;
  start_date: string;
  last_activity: string;
  lastAssignment: any;
  last_assign: any;
  status: string;
  count_messages: any;
  advisorId: any;
  id_asignacion: any;
}

export interface conversationSelected {
  id: number;
  contact: Contact;
  messages: Message;
  uuid: any;
  date_remenber: DateRemenber;
  advisorName: string;
  advisorId: number;
  id_asignacion: number;
  status: string;
  start_date: any;
  last_activity: any;
  lastAssignment: any;
  last_assign: any;
  count_messages: any;
}

export interface Attachment{
  attachmentId: number;
  messageId: string;
  url: string;
  mime_type: string;
  sha256: string;
  file_size: string
}
export interface Body {
  mensaje: any;
}

export interface Message {
  id: any;
  emisor: string;
  type: string;
  content: any;
  referral: any;
  date_of_issue: any;
  emisor_id: any;
  status_m: any;
  customer: any;
  num_phone: any;
}

export interface ClousureReason{
  id: number;
  name: string;
}

export interface Roles{
  id: number;
  name: string;
}

export interface Answer{
  id: number;
  title: string;
  message: string;
  type: string;
}

export interface Conexions{
  id: number;
  company_name: string;
  phone: string;
  welcome: string;
  updated_at: string;
  status_bot: any;
}

export interface Customer{
  id: number;
  name: string;
  asignId: any;
}

export interface Quickly{
  id: number;
  title: string;
  message: string;
  type: string;
  type_media: string;
  link: string;
}

export interface Asignment {
  advisor_name: string;
  contact_name: string;
  last_activity: string;
  type: string;
  formattedLastActivity: string;
}

export interface WaitTimes {
  Contacto: any;
  Espera: any;
}

export interface closedClients {
  advisor: any;
  contacts: any;
}

export interface massMessages {
  id: number;
  campaign_name: string;
  content_type: string;
  user: any;
  date: any;
  count_contact: any;
  status: any;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
}

export interface Notificacion {
  id: number;
  advisorName: string;
  contact_name: string;
  last_activity: string;
}