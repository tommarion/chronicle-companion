import * as React from "react"
import {useEffect, useState} from "react";
import {getBaseURL} from "../../js/common";

type AdminSettingsProps = {
    campaignId: string
}

export default function AdminSettings(props: AdminSettingsProps) {
    const [accountData, setAccountData] = useState<CharacterAccounts>(null);
    useEffect(() => {
        fetch(getBaseURL() + "campaign/" + props.campaignId + "/character/accounts")
            .then(response => response.json())
            .then(result => {
                setAccountData({
                    characterAccounts: new Map<string, string>(Object.entries(result.characterAccounts)),
                    accounts: new Map<string, string>(Object.entries(result.accounts)),
                    characters: result.characters
                });
            })
            .catch(e => {
                console.error(e);
            });
    }, []);
    return (
        <div id={'character-accounts__wrapper'}>
            <div className={'title'}>Character Accounts</div>
            <div id={'character-account__wrapper'} className={'table'}>
                {accountData === null ? "loading" :
                    accountData.characters.length == 0 ? <div>No Characters Yet!</div> :
                        accountData.characters.map((character) => <div className={'row'}>
                                <div>{character.name}</div>
                                <select value={accountData && accountData.characterAccounts ?
                                        accountData.characterAccounts.get(character.id) : null}>
                                    {Array.from(accountData.accounts.keys()).map((account) =>
                                        <option value={account}>
                                            {accountData.accounts.get(account)}
                                        </option>)}
                                </select>
                            </div>)
                }
            </div>
        </div>
    )
}