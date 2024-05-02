import express from "express";

import {Request, Response} from 'express';


export enum Error {
    INVALID_NAME = "Invalid name",
    GAME_NOT_FOUND = "Game not found",
    GAME_FULL = "Game is full",
    NAME_TAKEN = "Name is already taken",
    NO_HOSTNAME_PROVIDED = "No hostname provided",
}

const err = (err: Error) => ({ error: err });

export interface Player {
    name: string;
    uid: string;
}

const createPlayer = (name: string) => ({
        name,
        uid: createRandomHexString(16),
    });

export enum GameState {

    WAITING_FOR_PLAYERS = "Waiting for players",

    PLAYING = "Playing", // tmp

}

export interface Game {
    code: string;
    players: Player[];
    state: GameState;
}

const nameTaken = (name: string, game: Game) => {
    // Linear search is an acceptable solution b/c upper
    // bound on number of players is very small 
    for (const player of game.players) {
        if (player.name === name) return true;
    }
    return false;
}

const games: Record<string, Game> = {}

const createRandomHexString = (length: number) =>
    [...Array(length)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("")
      .toUpperCase();

export const createNewGame = async (req: Request, res: Response) => {

    const hostName = req.query.hostName; 

    if (!hostName) {    // if the hostname request is null we 
                        // tell client they failed to provide one
        res.status(400).json(err(Error.NO_HOSTNAME_PROVIDED));
        return;
    }

    let code = "";                          // empty join code...
    while (code === "" || code in games) {  // if the code is empty or taken
        code = createRandomHexString(5);    // create a join code
    }






}
