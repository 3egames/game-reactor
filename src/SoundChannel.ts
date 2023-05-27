export class SoundChannel {
  private audio: HTMLAudioElement;
  private status: 'playing' | 'ready' | 'paused'

  constructor() {
    this.status = 'ready';
    this.audio = new Audio();
    this.audio.onplay = () => { this.status = 'playing' };
    this.audio.onplaying = () => { this.status = 'playing' };
    this.audio.onwaiting = () => { this.status = 'ready' };
    this.audio.onpause = () => { this.status = 'paused' };
    this.audio.onended = () => { this.status = 'ready' };
  }

  public get Status(): string {
    return this.status;
  }

  public get Source(): string {
    return this.audio.src;
  }

  public set Source(value: string) {
    this.audio.src = value;
  }

  async play() {
    if (typeof window !== 'undefined') {
      await this.audio.play().catch(e => console.log(e));
      this.status = 'playing'
    }
  }

  pause() {
    if (typeof window !== 'undefined') this.audio.pause();
  }

  mute() {
    if (typeof window !== 'undefined') this.audio.muted = true;
  }

  unmute() {
    if (typeof window !== 'undefined') this.audio.muted = false;
  }
}
