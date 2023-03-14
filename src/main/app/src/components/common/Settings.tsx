import * as React from "react"
import AdminSettings from "./AdminSettings";

type PropsSettings = {
    admin:      boolean
    campaignId: string
}
export default function Settings(props: PropsSettings) {
    return (
        <div id='settings__wrapper'>
            {props.admin ? <AdminSettings campaignId={props.campaignId}></AdminSettings> : null}
            <div className={'btn'} onClick={() => window.history.back()}>Return to Books</div>
            <div className={'btn'} onClick={() => window.location.pathname = '/logout'}>Logout</div>
        </div>
    )
}