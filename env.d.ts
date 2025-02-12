/////////////////////////////// cubething.dev /////////////////////////////////

declare module "bun" {
  interface Env {
    HOT: string;
    BLOG_PREFIX: string;
    SHOW_PRIVATE_APPS: string;
    LOG_LEVEL: string;
    WAKE_PW: string;
  }
}
