import { getEnvVar } from "@/lib/env-vars"

import { setupDayJs } from "./dates"

export const isProduction = () => getEnvVar("APP_ENV") === "production"

export const isTesting = () => getEnvVar("APP_ENV") === "testing"

export const isDevelopment = () => getEnvVar("NODE_ENV") === "development"

export const setupLibraries = () => {
  setupDayJs()
}

export const safeJSONParse = <T>(json: string): T => {
  try {
    return JSON.parse(json) as T
  } catch (e) {
    console.error("Error parsing JSON", e)

    return {} as T
  }
}
