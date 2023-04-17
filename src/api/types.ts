export interface UserRole {
  id: number;
  name: string;
  description: string;
  type: string;
  //iso date string
  createdAt: string;
  //iso date string
  updatedAt: string;
  nb_users: number;
}

export interface GigEvent {
  id: number;
  date: string;
  location: string;
  gross: null | number;
  deposit: null | number;
  amountDue: null | number;
  profit: null | number;
  createdAt: string;
  updatedAt: string;
  notes: null | string;
  team: null | string;
  googleDocId: null | string;
  clientCanEdit: boolean;
  payments: null | string;
  notesFromClient: null | string;
  package: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  jobs: [];
  sets: [];
  type: {
    id: 2;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  client: {
    id: 7;
    createdAt: string;
    updatedAt: string;
    fName: string;
    lName: string;
    phone: null | string;
  };
  createdBy: null | string;
  updatedBy: null | string;
}
