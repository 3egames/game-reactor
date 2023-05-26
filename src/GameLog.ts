import Game from "./Game";

export enum GameLogLevels {
  warn, info, debug
}

export default class GameLog {
  logLevel: GameLogLevels;
  gameId: string;

  constructor(gameId: string, logLevel: GameLogLevels) {
    this.logLevel = logLevel;
    this.gameId = gameId;
  }

  /**
   * Debug messages will show only when level is debug
   * @param message 
   */
  debug(message: string) {
    if (this.logLevel == GameLogLevels.debug) {
      console.log(`[GID${this.gameId}][DEBUG] ${message}`)
    }
  }

  /**
   * Info messages will show when the level is info or greater
   * @param message 
   */
  info(message: string) {
    if (this.logLevel >= GameLogLevels.info) {
      console.log(`[GID${this.gameId}][INFO] ${message}`)
    }
  }

  /**
     * Warn messages will show when the level is warn or greater
     * @param message 
     */
  warn(message: string) {
    if (this.logLevel >= GameLogLevels.warn) {
      console.log(`[GID${this.gameId}][WARN] ${message}`)
    }
  }
}
