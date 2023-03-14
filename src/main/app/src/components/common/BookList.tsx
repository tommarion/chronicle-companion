import * as React from 'react';
import {getBaseURL} from "../../js/common";
import Book from "./Book";
import '../../stylesheet/book.css';
import SoundType from "../../data/enum/SoundType";
import {BookPosType} from "../../data/enum/BookPosType";

type BookListProps = {
    onClick: Function
    newBookClick: Function
    playSoundHandler: Function
}

type BookListState = {
    isFetching: boolean,
    index:      number,
    selected:   string,
    campaigns: [{
        id:         string,
        name:       string,
        enabled:    boolean,
        gameType:   string,
        character: {
            name:       string,
            id:         string
        },
        sessions:   number,
        lastPlayed: string,
        players:    CharacterInterface[]
    }]
}

class BookList extends React.Component<BookListProps, BookListState> {
    constructor(props : BookListProps) {
        super(props);

        this.state = {
            selected: null,
            isFetching: false,
            campaigns: null,
            index : 0
        }
    }
    componentDidMount() {
        this.fetchCampaigns();
    }

    render() {
        return (
            <div className="campaign-books__wrapper">
                <div className="campaign-books" style={{left: (-250 * this.state.index) + 'px'}}>
                    {
                        this.state.campaigns ?
                            this.state.campaigns.map((campaign, index) => {
                                return (
                                    <Book key={index} name={campaign.name} id={campaign.id} gameType={campaign.gameType}
                                          hover={this.state.index==index}
                                          characterName={campaign.character.name} characterId={campaign.character.id}
                                          enabled={campaign.enabled} opened={campaign.id === this.state.selected}
                                          sessions={campaign.sessions} lastPlayed={campaign.lastPlayed} players={campaign.players}
                                          onClick={() => this.handleBookClick(campaign.id, index)}
                                          onCharacterClick={() => this.props.onClick(campaign.gameType, campaign.id)}
                                    />
                                );
                            }) : null
                    }
                    <Book name="Host New Game" id={null} characterName={null} enabled={true} characterId={null}
                          hover={this.state.campaigns ? this.state.index==this.state.campaigns.length : false}
                          gameType={"dnd"} opened={this.state.selected === "new"}
                          sessions={0} lastPlayed={null} players={[]}
                          onClick={() => this.handleBookClick("new", this.state.campaigns.length)}
                          newBookClick={(gameType: string, campaignName: string) =>
                              this.props.newBookClick(gameType, campaignName)}></Book>
                </div>
                <div className={"campaign-books-left btn btn-book-pos" + (this.state.index === 0 ? ' disabled' : '')}
                     onClick={() => this.handleBookPosClick(BookPosType.DECREASE)}
                >{`<`}</div>
                <div className={"campaign-books-right btn btn-book-pos" +
                        (this.state.campaigns && this.state.index ===  this.state.campaigns.length ? ' disabled' : '')}
                     onClick={() => this.handleBookPosClick(BookPosType.INCREASE)}
                >{`>`}</div>
            </div>
        );
    }

    handleBookPosClick(change : BookPosType) {
        let index = this.state.index;
        if ( change === BookPosType.INCREASE &&
                this.state.index < this.state.campaigns.length) {
            index++;
        } else if ( change === BookPosType.DECREASE &&
                this.state.index > 0) {
            index--;
        }
        if (this.state.selected) {
            this.props.playSoundHandler(SoundType.BOOK_CLOSE);
        }
        this.setState({
            selected: null,
            isFetching: this.state.isFetching,
            index: index,
            campaigns: this.state.campaigns
        });
    }

    handleBookClick(id : string, index: number) {
        if (this.state.selected !== id) {
            if (this.state.selected === null) {
                this.props.playSoundHandler(SoundType.BOOK_OPEN);
            } else {
                this.props.playSoundHandler(SoundType.BOOK_CLOSE);
                this.props.playSoundHandler(SoundType.BOOK_OPEN);
            }
        } else {
            this.props.playSoundHandler(SoundType.BOOK_CLOSE);
        }
        this.setState({
            ...this.state,
            selected: this.state.selected === id ? null : id,
            index: index,
        });
    }

    fetchCampaignsWithFetchAPI = () => {
        this.setState({...this.state, isFetching: true});
        fetch(getBaseURL() + "campaigns")
            .then(response => response.json())
            .then(result => {
                console.log(result);
                this.setState({campaigns: result, isFetching: false})
            })
            .catch(e => {
                console.error(e);
                this.setState({...this.state, isFetching: false});
            });
    };

    fetchCampaigns = this.fetchCampaignsWithFetchAPI;
}

export default BookList;