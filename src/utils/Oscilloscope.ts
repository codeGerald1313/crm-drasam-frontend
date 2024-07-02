import { getWaveBlob  } from "webm-to-wav-converter";
import { useConversationStore } from '../stores/conversation';

class Oscilloscope {
    
    private audioContext: AudioContext;
    private analyser: AnalyserNode;
    private dataArray: Uint8Array;
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private isDrawing: boolean = false;
    private animationFrameId: number | null = null;
  
    constructor(canvasId: string) {
      this.audioContext = new (window as any).AudioContext || (window as any).webkidAudioContext;
      this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.startDrawing();
    }

    async initialize() {
        await navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);
            this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm'});
            this.mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                this.audioChunks.push(event.data);
              }
            };
            this.mediaRecorder.onstop = async() => {
                const useConversation = useConversationStore();
                const recordedAudioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                
                // const wavBlob = await getWaveBlob(recordedAudioBlob, true);

                const url = URL.createObjectURL(recordedAudioBlob);
                const au = document.createElement('audio');
                au.controls = true;
                au.src = url;

                const file = new File([recordedAudioBlob], "audio.mp3");

                useConversation.getFileAudio(file);
            };
          })
          .catch((err) => {
            console.log('Error al acceder al micrófono: ' + err);
          });
    }

    startDrawingVisualization() {
        this.isDrawing = true;
        this.draw();
    }

    stopDrawingVisualization() {
        this.isDrawing = false;
        // cancelAnimationFrame(this.animationFrameId);
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
      
    startRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
            this.mediaRecorder.start();
            this.startDrawingVisualization();
        }
    }
  
    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.audioChunks = [];
            this.stopDrawingVisualization();
            // this.mediaRecorder=null
        }
    }

    cleanup() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
        }
    }
  
    private draw() {
      this.analyser.getByteTimeDomainData(this.dataArray);
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      this.canvasContext.beginPath();
      const sliceWidth = this.canvas.width / this.dataArray.length;
      let x = 0;
  
        for (const data of this.dataArray) {
            const y = (data / 256) * this.canvas.height;
            if (x === 0) {
            this.canvasContext.moveTo(x, y);
            } else {
            this.canvasContext.lineTo(x, y);
            }
            x += sliceWidth;
        }
  
        this.canvasContext.strokeStyle = 'rgb(248, 188, 2)';
        // this.canvasContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
        // this.canvasContext.shadowBlur = 5;
        // this.canvasContext.fillText('Frecuencia', 10, 20);
        // this.canvasContext.fillText('Amplitud', 10, this.canvas.height - 10);
        // this.canvasContext.fillStyle = 'lightgray';
        // this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.lineWidth = 2;
        this.canvasContext.stroke();

        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }
  
    private startDrawing() {
        if (this.isDrawing) {
            this.animationFrameId = requestAnimationFrame(() => this.draw());
        }
    }
}

export default Oscilloscope;