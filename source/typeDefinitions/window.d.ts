import { Environment as MonacoEnvironment } from "monaco-editor";
import { GlobalProps } from "@/models/GlobalProps";
import getTimeZoneOffsetInMin from "@/utils/getTimeZoneOffsetInMin";

export {};

declare global {
  interface Window {
    analytics: SegmentAnalytics.AnalyticsJS;
  }
}
