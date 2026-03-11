// Re-export auth types from backend
// This file exists to avoid import path issues during Docker builds
export type { Auth } from "../../backend/src/lib/auth";
