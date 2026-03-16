// Happy Birthday melody notes (simplified)
// Format: [frequency in Hz, duration in seconds]
const HAPPY_BIRTHDAY_NOTES: [number, number][] = [
  // "Happy birthday to you"
  [262, 0.3], [262, 0.3], [294, 0.6], [262, 0.6], [349, 0.6], [330, 1.2],
  // "Happy birthday to you"
  [262, 0.3], [262, 0.3], [294, 0.6], [262, 0.6], [392, 0.6], [349, 1.2],
  // "Happy birthday dear..."
  [262, 0.3], [262, 0.3], [523, 0.6], [440, 0.6], [349, 0.6], [330, 0.6], [294, 1.2],
  // "Happy birthday to you"
  [466, 0.3], [466, 0.3], [440, 0.6], [349, 0.6], [392, 0.6], [349, 1.2],
]

export class BirthdayMelody {
  private audioContext: AudioContext | null = null
  private isPlaying = false
  private timeoutIds: NodeJS.Timeout[] = []

  async play(): Promise<void> {
    if (this.isPlaying) return

    try {
      this.audioContext = new AudioContext()
      this.isPlaying = true

      const playNote = (frequency: number, startTime: number, duration: number) => {
        if (!this.audioContext) return

        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(frequency, startTime)

        // Soft envelope
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05)
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + duration * 0.7)
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration)

        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
      }

      const playMelody = () => {
        if (!this.audioContext || !this.isPlaying) return

        let currentTime = this.audioContext.currentTime

        HAPPY_BIRTHDAY_NOTES.forEach(([freq, dur]) => {
          playNote(freq, currentTime, dur * 0.9)
          currentTime += dur
        })

        // Loop the melody
        const totalDuration = HAPPY_BIRTHDAY_NOTES.reduce((sum, [, dur]) => sum + dur, 0) * 1000
        const timeoutId = setTimeout(() => {
          if (this.isPlaying) {
            playMelody()
          }
        }, totalDuration + 500)
        this.timeoutIds.push(timeoutId)
      }

      playMelody()
    } catch (error) {
      console.log('Audio playback failed:', error)
    }
  }

  stop(): void {
    this.isPlaying = false
    this.timeoutIds.forEach(id => clearTimeout(id))
    this.timeoutIds = []

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }

  toggle(): boolean {
    if (this.isPlaying) {
      this.stop()
      return false
    } else {
      this.play()
      return true
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying
  }
}
