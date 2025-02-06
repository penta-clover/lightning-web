import { track } from "@amplitude/analytics-browser";
import { BaseEvent, EventOptions } from "@amplitude/analytics-types";

export function condTrack(eventInput: string | BaseEvent, eventProperties?: Record<string, any> | undefined, eventOptions?: EventOptions | undefined) {
    if (process.env.NEXT_PUBLIC_AMPLITUDE_TRACKING_ENABLED === "true") {
        track(eventInput, eventProperties, eventOptions);
    }
}