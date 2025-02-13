/////////////////////////////// cubething.dev /////////////////////////////////

declare module "bun" {
  interface Env {
    HOT: string;
    BLOG_PREFIX: string;
    SHOW_PRIVATE_APPS: string;
    LOG_LEVEL: string;
    WAKE_PW: string;
    WAKE_REMOTE_PORT: string;
    WAKE_REMOTE_IP: string;
    WAKE_MC_SERVER_PORT: string;
    WAKE_MC_SERVER_IP: string;
  }
}
