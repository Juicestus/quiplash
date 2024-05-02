import express from "express";

import {Request, Response} from 'express';

const MAX_PLAYERS = 6;
const JOIN_CODE_LENGTH = 5;

export enum Error {
    INVALID_NAME = "Invalid name",
    GAME_NOT_FOUND = "Game not found",
    GAME_FULL = "Game is full",
    NAME_TAKEN = "Name is already taken",
    NO_NAME_PROVIDED = "No name provided",
    NO_JOIN_CODE_PROVIDED = "No join code provided"
}

const err = (err: Error) => ({ error: err });

export interface Player {
    name: string;
    uid: string;
}

const createPlayer = (name: string) => ({
        name,
        uid: createRandomHexString(16), // this is for possible 
                                        // security improvements
                                        // in the future
    });

export enum GameState {

    WAITING_FOR_PLAYERS = "Waiting for players",

    PLAYING = "Playing", // tmp

}

export interface Game {
    code: string;
    hostname: string;
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

setInterval(() => console.log(JSON.stringify(games), 5000));

const createRandomHexString = (length: number) =>
    [...Array(length)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("")
      .toUpperCase();

export const createNewGame = async (req: Request, res: Response) => {
    const hostName = req.query.hostName as string; 

    if (!hostName) {    // if the hostname request is null we 
                        // tell client they failed to provide one
        res.status(400).json(err(Error.NO_NAME_PROVIDED));
        return;
    }

    let code = "";                          // empty join code...
    while (code === "" || code in games) {  // if the code is empty or taken
        code = createRandomHexString(JOIN_CODE_LENGTH);    // create a join code
    }

    games[code] = {
        code,
        hostname: hostName,
        players: [ createPlayer(hostName) ],
        state: GameState.WAITING_FOR_PLAYERS,
    }

    console.log("Game created with code " + code + " and host " + hostName);

    return res.status(200).send({
        code: code,
        name: hostName
    });
}

export const joinGame = async (req: Request, res: Response) => {
    const code = req.query.code as string;
    if (!code) {
        res.status(400).json(err(Error.NO_JOIN_CODE_PROVIDED));
        return;
    }

    const name = req.query.name as string;
    if (!name) {
        res.status(400).json(err(Error.NO_NAME_PROVIDED));
        return;
    }

    if (!(code in games)) {
        res.status(404).json(err(Error.GAME_NOT_FOUND));
        return;
    }

    if (games[code].players.length >= MAX_PLAYERS) {
        res.status(400).json(err(Error.GAME_FULL));
        return;
    }

    if (nameTaken(name, games[code])) {
        res.status(400).json(err(Error.NAME_TAKEN));
        return;
    }

    games[code].players.push(createPlayer(name));

    return res.status(200).send({
        code: code,
        name: name 
    });
}
