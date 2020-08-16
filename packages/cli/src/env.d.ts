// Declaring Custom ENV
declare namespace NodeJS {
  export interface ProcessEnv {
    PLUG_TOKEN: string;
    FIREBASE_API_KEY: string;
    FIREBASE_AUTH_DOMAIN: string;
    FIREBASE_DATABASE_URL: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_STORAGE_BUCKET: string;
    FIREBASE_MSG_ID: string;
    FIREBASE_APP_ID: string;
    FIREBASE_MSR_ID: string;
    GOOGLEAPIS_KEY: string;
    REST_API_URL: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URL: string;
  }
}
