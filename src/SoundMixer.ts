import GameLog from "./GameLog";
import SoundChannel from "./SoundChannel";

/** The soundMixer controls multiple layers of Audio and their sources */
export default class SoundMixer {
  private logger: GameLog;
  private sources: { [key: string]: string };
  private channels: SoundChannel[];

  /**
   * Creates a new instance of the SoundMixer
   * @param logger Game logger to aide in debuging
   * @param channelCount The number of Audio channels to reserve
   */
  constructor(logger: GameLog, channelCount = 10) {
    this.logger = logger;
    this.sources = {};
    this.channels = [];
    this.logger.info(`Initiating ${channelCount} Audio Channels...`)
    for (let i = 0; i < channelCount; i += 1) {
      this.channels[i] = new SoundChannel();
      this.channels[i].mute();
    }
  }

  /** Retrieves the next available Audio channel */
  private getNextAvailableChannel() {
    const index = this.channels.findIndex((c) => {
      return c.Status === 'ready'
    });
    if (index < 0) throw new Error('Too much audio playing at once');
    return index;
  }

  /**
   * Adds a new audio source
   * @param id identifier key
   * @param path the URI
   */
  addSource(id: string, path: string) {
    if (this.sources[id]) {
      throw new Error(`Sound source '${id}' already exists`);
    }
    this.sources[id] = path;
    this.logger.debug(`Added sound '${id}' with source '${path}'`)
  }

  /**
   * Play a previously added audio source
   * @param id the identifier key of the audio source
   */
  async play(id: string) {
    if (!this.sources[id]) {
      throw new Error(`Sound source '${id}' does not exist`);
    }
    if (typeof window !== 'undefined') {
      const sourceIndex = this.getNextAvailableChannel();
      this.logger.debug(`Playing ${id} on channel#${sourceIndex}`)
      this.channels[sourceIndex].Source = this.sources[id];
      this.channels[sourceIndex].unmute();
      await this.channels[sourceIndex].play();
    }
  }

  /** Stop all audio */
  stopAll() {
    this.logger.info('Pausing audio channels')
    if (typeof window !== 'undefined') {
      this.channels.map(c => {
        if (c.Status !== 'ready') {
          c.pause();
          c.mute();
        }
      });
    }
  }
}
