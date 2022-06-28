import splitbee from '@splitbee/web'

export default function useSplitbee() {
    function splitbeeInit() {
        splitbee.init()
    }

    function SplitbeeEvent(storeTitle) {
        splitbee.track(`${storeTitle} link clicked`, { plan: "Store link followed" })
    }

    return {
        splitbeeInit,
        SplitbeeEvent
    }
}