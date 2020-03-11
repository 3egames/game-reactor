let sources;
let channels;

function getNextAvailableChannel() {
  for (let i = 0; i < channels.length; i += 1) {
    if (isNaN(channels[i].duration)
      || channels[i].ended
      || (channels[i].duration <= 0 && channels[i].paused)) {
      return channels[i];
    }
  }
  throw new Error('Too much audio playing at once');
}

export default class SoundMixer {
  constructor(game, channelCount = 10) {
    this.game = game;
    sources = {};
    channels = [];
    for (let i = 0; i < channelCount; i += 1) {
      channels[i] = new Audio();
    }
  }

  addSource(id, path) {
    if (sources[id]) {
      throw new Error(`Sound source '${id}' already exists`);
    }
    sources[id] = path;
  }

  play(id) {
    if (!sources[id]) {
      throw new Error(`Sound source '${id}' does not exist`);
    }
    const ch = getNextAvailableChannel();
    ch.src = sources[id];
    ch.play();
  }

  stop() {
    for (let i = 0; i < channels.length; i += 1) {
      if (!channels[i].ended || !channels[i].paused) {
        channels[i].pause();
      }
    }
  }
}
