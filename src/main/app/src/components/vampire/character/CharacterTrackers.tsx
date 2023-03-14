import * as React from "react";
import '../../../stylesheet/trackers.css';

export type CharacterTrackersProps = {
    attributes: CharacterSheetAttributesInterface
    trackers: CharacterTrackersInterface
}

export default function CharacterTrackers(props: CharacterTrackersProps) {
    return (
        <div id={'tracker-table'} className={'table'}>
            <div className={'row'}>
                <div>Health</div>
                <div id={'health-tracker'}
                     className={'maxlevel' + (props.attributes.physical.stamina + 3) +
                         ' superficial' + (props.trackers.healthSuperficial) +
                         ' aggravated' + (props.trackers.healthAggravated)}></div>
            </div>
            <div className={'row'}>
                <div>Hunger</div>
                <div id={'hunger-tracker'}
                     className={'level' + (props.trackers.hunger)}></div>
            </div>
            <div className={'row'}>
                <div>Willpower</div>
                <div id={'willpower-tracker'}
                     className={'maxlevel' + (props.attributes.social.composure + props.attributes.mental.resolve) +
                         ' superficial' + (props.trackers.healthSuperficial) +
                         ' aggravated' + (props.trackers.healthAggravated)}></div>
            </div>
            <div className={'row'}>
                <div>Humanity</div>
                <div id={'humanity-tracker'}
                     className={'maxlevel' + (props.trackers.humanityMax) +
                         ' stains' + (props.trackers.humanityStains)}></div>
            </div>
        </div>
    );
}