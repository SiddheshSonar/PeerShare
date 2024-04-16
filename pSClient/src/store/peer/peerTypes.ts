export enum PeerActionType {
    PEER_SESSION_START = 'PEER_SESSION_START',
    PEER_SESSION_STOP = 'PEER_SESSION_STOP',
    PEER_LOADING = 'PEER_LOADING',
    PEER_TOGGLE_ME = 'PEER_TOGGLE_ME'
}

export interface PeerState {
    readonly id?: string
    readonly loading: boolean
    readonly started: boolean
    readonly mE: boolean
}