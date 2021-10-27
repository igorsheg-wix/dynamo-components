import { PropRef } from "preact/hooks/src";
interface CustomEvent {
    ref: PropRef<any>;
    eventName: string;
}
declare const useCustomEvent: ({ ref, eventName }: CustomEvent) => (evData: any) => void;
export default useCustomEvent;
