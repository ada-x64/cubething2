/////////////////////////////// cubething.dev /////////////////////////////////

declare module "bun" {
  interface Env {
    // build-time env vars
    HOT: string;
    DEFAULT_APP: string;
    SHOW_PRIVATE_APPS: string;
    LOG_LEVEL: string;
    // run-time encrypted env vars
    WAKE_PW: string;
    WAKE_REMOTE_SERVER: string;
    WAKE_MC_SERVER_PORT: string;
    WAKE_MC_SERVER_IP: string;
  }
}
